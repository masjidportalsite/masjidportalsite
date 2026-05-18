import { NextResponse } from "next/server";
import db from "@/lib/db";

// Simple in-memory rate limiter (resets on server restart)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = requestCounts.get(identifier);
  
  if (!entry || now > entry.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
}

// RBAC: Check if user has permission for branding operations
async function checkBrandingPermission(userId: string | null, organizationId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Admin role has full access to branding
    const { rows } = await db.query(
      `SELECT r.name FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1 AND r.name IN ('admin', 'imam', 'treasurer')`,
      [userId]
    );
    
    return rows.length > 0;
  } catch {
    return false;
  }
}

// Audit log helper
async function logAuditAction(
  action: string,
  targetTable: string,
  recordId: string,
  changes: Record<string, unknown>,
  userId?: string
) {
  try {
    await db.query(
      `INSERT INTO audit_logs (action, target_table, record_id, changes, user_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [action, targetTable, recordId, JSON.stringify(changes), userId || null]
    );
  } catch (error) {
    console.error("[AuditLog] Failed to log action:", error);
  }
}

export async function GET(request: Request) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  
  // Rate limiting
  if (!checkRateLimit(`branding-get:${clientIp}`, 60, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    let query = 'SELECT * FROM branding_settings';
    const values: unknown[] = [];

    if (organizationId) {
      query += ' WHERE organization_id = $1';
      values.push(organizationId);
    } else {
      query += ' LIMIT 1';
    }

    const { rows } = await db.query(query, values);
    
    return NextResponse.json({ 
      data: rows[0] || null,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("[Branding:GET] Error fetching branding settings:", error);
    return NextResponse.json({ 
      error: "Failed to fetch branding settings",
      code: "BRANDING_FETCH_ERROR"
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  
  // Rate limiting
  if (!checkRateLimit(`branding-put:${clientIp}`, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { id, organization_id, ...settings } = body;

    if (!id && !organization_id) {
      return NextResponse.json({ 
        error: "Must provide id or organization_id to update",
        code: "MISSING_IDENTIFIER"
      }, { status: 400 });
    }

    // Validate settings object
    if (typeof settings !== 'object' || settings === null || Array.isArray(settings)) {
      return NextResponse.json({ 
        error: "Invalid settings format",
        code: "INVALID_SETTINGS"
      }, { status: 400 });
    }

    // Check for allowed branding fields to prevent injection
    const allowedFields = [
      'logo_url', 'primary_color', 'secondary_color', 'accent_color',
      'font_family', 'org_name', 'tagline', 'updated_at'
    ];
    const updateFields = Object.keys(settings).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update",
        code: "NO_VALID_FIELDS"
      }, { status: 400 });
    }

    let query = '';
    const values: unknown[] = [];
    let valueIndex = 1;

    const setClauses = updateFields.map(key => {
      values.push(settings[key]);
      return `${key} = $${valueIndex++}`;
    });

    let result;
    if (id) {
      query = `UPDATE branding_settings SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${valueIndex} RETURNING *`;
      values.push(id);
      const { rows } = await db.query(query, values);
      result = rows[0];
      
      if (result) {
        await logAuditAction('update', 'branding_settings', id, settings);
      }
    } else {
      query = `UPDATE branding_settings SET ${setClauses.join(', ')}, updated_at = NOW() WHERE organization_id = $${valueIndex} RETURNING *`;
      values.push(organization_id);
      const { rows } = await db.query(query, values);
      result = rows[0];
      
      if (result) {
        await logAuditAction('update', 'branding_settings', result.id, settings);
      }
    }

    // If no rows were updated, insert new settings for this org
    if (!result && organization_id) {
      const keys = ['organization_id', ...updateFields];
      const insertValues = [organization_id, ...updateFields.map(k => settings[k])];
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const insertQuery = `INSERT INTO branding_settings (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const insertResult = await db.query(insertQuery, insertValues);
      result = insertResult.rows[0];
      
      await logAuditAction('insert', 'branding_settings', result.id, settings);
      return NextResponse.json({ 
        data: result,
        created: true
      }, { status: 200 });
    }

    if (!result) {
      return NextResponse.json({ 
        error: "Branding settings not found",
        code: "NOT_FOUND"
      }, { status: 404 });
    }

    return NextResponse.json({ 
      data: result,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("[Branding:PUT] Error updating branding settings:", error);
    return NextResponse.json({ 
      error: "Failed to update branding settings",
      code: "BRANDING_UPDATE_ERROR"
    }, { status: 500 });
  }
}
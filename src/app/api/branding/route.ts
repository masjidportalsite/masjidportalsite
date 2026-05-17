import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get("organizationId");

        let query = 'SELECT * FROM branding_settings';
        const values: unknown[] = [];

        if (organizationId) {
            query += ' WHERE organization_id = $1';
            values.push(organizationId);
        } else {
            // Default to the first branding settings found if no org specified (for single tenant fallback)
            query += ' LIMIT 1';
        }

        const { rows } = await db.query(query, values);
        return NextResponse.json({ data: rows[0] || null }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching branding settings:", error);
        return NextResponse.json({ error: "Failed to fetch branding settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, organization_id, ...settings } = body;

        if (!id && !organization_id) {
            return NextResponse.json({ error: "Must provide id or organization_id to update" }, { status: 400 });
        }

        let query = '';
        const values: unknown[] = [];
        let valueIndex = 1;

        const setClauses = Object.keys(settings).map(key => {
            values.push(settings[key]);
            return `${key} = $${valueIndex++}`;
        });

        if (id) {
            query = `UPDATE branding_settings SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${valueIndex} RETURNING *`;
            values.push(id);
        } else {
            // Using organization_id
            query = `UPDATE branding_settings SET ${setClauses.join(', ')}, updated_at = NOW() WHERE organization_id = $${valueIndex} RETURNING *`;
            values.push(organization_id);
        }

        const { rows } = await db.query(query, values);

        // If no rows were updated, it might mean the settings don't exist yet for this org. Let's insert them.
        if (rows.length === 0 && organization_id) {
            const keys = ['organization_id', ...Object.keys(settings)];
            const insertValues = [organization_id, ...Object.values(settings)];
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const insertQuery = `INSERT INTO branding_settings (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            const insertResult = await db.query(insertQuery, insertValues);
            return NextResponse.json({ data: insertResult.rows[0] }, { status: 200 });
        }

        return NextResponse.json({ data: rows[0] }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error updating branding settings:", error);
        return NextResponse.json({ error: "Failed to update branding settings" }, { status: 500 });
    }
}

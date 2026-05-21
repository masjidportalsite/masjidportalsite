import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTenantContext } from "@/services/core/tenant";
import { OrganizationService } from "@/services/organization.service";

export async function GET() {
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const insforgeToken = cookieStore.get('insforge_session')?.value;

        const user = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const context = getTenantContext(user);
        const orgService = new OrganizationService(context, insforgeToken);
        
        const result = await orgService.getBrandingSettings();
        
        if (result.error) {
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        return NextResponse.json({ data: result.data }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching branding settings:", error);
        return NextResponse.json({ error: "Failed to fetch branding settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const insforgeToken = cookieStore.get('insforge_session')?.value;

        const user = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, organization_id, ...settings } = body;

        const context = getTenantContext(user);
        const orgService = new OrganizationService(context, insforgeToken);

        const result = await orgService.updateBrandingSettings(settings);

        if (result.error) {
            const status = result.error.code === 'VALIDATION_FAILED' ? 400 : 500;
            return NextResponse.json({ error: result.error.message }, { status });
        }

        return NextResponse.json({ data: result.data }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error updating branding settings:", error);
        return NextResponse.json({ error: "Failed to update branding settings" }, { status: 500 });
    }
}

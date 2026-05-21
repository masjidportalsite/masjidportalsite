-- ─── PHASE 2: ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────
-- Target: Enforce Multi-tenant isolation at the Database Layer.
-- Author: MasjidPortal Admin
-- Date: 2026-05-21

-- 1. ENABLE RLS ON CORE TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- 2. ORGANIZATION ISOLATION POLICIES (TENANT LEVEL)
-- Rule: Users can only see/edit data belonging to their organization.

-- USERS
CREATE POLICY "Organization Isolation" ON users
    FOR ALL 
    USING (organization_id = (current_setting('insforge.organization_id', true)::uuid))
    WITH CHECK (organization_id = (current_setting('insforge.organization_id', true)::uuid));

-- DONATIONS
CREATE POLICY "Organization Isolation" ON donations
    FOR ALL 
    USING (organization_id = (current_setting('insforge.organization_id', true)::uuid))
    WITH CHECK (organization_id = (current_setting('insforge.organization_id', true)::uuid));

-- EVENTS
CREATE POLICY "Organization Isolation" ON events
    FOR ALL 
    USING (organization_id = (current_setting('insforge.organization_id', true)::uuid))
    WITH CHECK (organization_id = (current_setting('insforge.organization_id', true)::uuid));

-- SETTINGS
CREATE POLICY "Organization Isolation" ON settings
    FOR ALL 
    USING (organization_id = (current_setting('insforge.organization_id', true)::uuid))
    WITH CHECK (organization_id = (current_setting('insforge.organization_id', true)::uuid));

-- 3. BYPASS FOR SUPER ADMINS (PLATFORM LEVEL)
-- Note: Requires 'insforge.role' metadata to be correctly injected by the SDK.
CREATE POLICY "Super Admin Bypass" ON users
    FOR ALL 
    USING (current_setting('insforge.role', true) = 'super_admin');

-- ─── UNDO SCRIPT ────────────────────────────────────────────────────────────────
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Organization Isolation" ON users;
-- ... repeat for other tables ...

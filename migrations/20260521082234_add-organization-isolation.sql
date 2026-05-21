-- Migration: Add Organization Isolation
-- Date: 2026-05-21

-- 1. ADD organization_id TO CORE TABLES WITH DEFAULT
DO $$ 
DECLARE 
    default_org_id UUID := '91f00ecb-9018-44f7-a8eb-aed3e028dab3';
    t text;
    tables text[] := ARRAY['users', 'roles', 'members', 'donors', 'campaigns', 'donations', 'receipts', 'events', 'audit_logs', 'event_registrations', 'volunteer_shifts', 'rewards_inventory', 'rewards_claims', 'settings'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS organization_id UUID DEFAULT %L;', t, default_org_id);
    END LOOP;
END $$;

-- 2. ENABLE ROW LEVEL SECURITY
DO $$ 
DECLARE 
    t text;
    tables text[] := ARRAY['users', 'roles', 'members', 'donors', 'campaigns', 'donations', 'receipts', 'events', 'announcements', 'audit_logs', 'event_registrations', 'volunteer_shifts', 'rewards_inventory', 'rewards_claims', 'branding_settings', 'prayer_times', 'settings'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    END LOOP;
END $$;

-- 3. CREATE POLICIES (ORGANIZATION ISOLATION)
DO $$ 
DECLARE 
    t text;
    tables text[] := ARRAY['users', 'roles', 'members', 'donors', 'campaigns', 'donations', 'receipts', 'events', 'announcements', 'audit_logs', 'event_registrations', 'volunteer_shifts', 'rewards_inventory', 'rewards_claims', 'branding_settings', 'prayer_times', 'settings'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Organization Isolation" ON public.%I;', t);
        EXECUTE format('CREATE POLICY "Organization Isolation" ON public.%I FOR ALL USING (organization_id = (current_setting(''insforge.organization_id'', true)::uuid)) WITH CHECK (organization_id = (current_setting(''insforge.organization_id'', true)::uuid));', t);
    END LOOP;
END $$;

-- 4. SUPER ADMIN BYPASS
DROP POLICY IF EXISTS "Super Admin Bypass" ON public.users;
CREATE POLICY "Super Admin Bypass" ON public.users
    FOR ALL USING (current_setting('insforge.role', true) = 'super_admin');

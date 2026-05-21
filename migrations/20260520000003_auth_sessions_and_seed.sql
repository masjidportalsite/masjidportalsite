-- Migration 0003: Auth Sessions & Demo Local Accounts Schema
-- Note: Assuming a custom auth approach as Next.js app will parse this password_hash directly or use an external library that relies on custom tables.

-- Enhance users table with local auth credentials
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON public.sessions 
FOR ALL USING (user_id = current_setting('insforge.user_id', true)::uuid);

-- Seed Demo Accounts
-- Note: In a production environment passwords would be hashed.
-- For demo purposes as requested, we insert plaintext or an explicitly known hash.
-- Using pgcrypto for simple crypt hash if we want security, or just storing the plaintext for the demo flow.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.users (email, full_name, role, password_hash)
VALUES
('admin@masjid.local', 'Admin Demo', 'super_admin', crypt('Demo123!', gen_salt('bf'))),
('imam@masjid.local', 'Imam Demo', 'imam', crypt('Demo123!', gen_salt('bf'))),
('treasurer@masjid.local', 'Treasurer Demo', 'treasurer', crypt('Demo123!', gen_salt('bf'))),
('member@masjid.local', 'Member Demo', 'community_member', crypt('Demo123!', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Masjid Portal Site - InsForge Database Schema & RLS

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'mosque_admin', 'imam', 'treasurer', 'community_member');
CREATE TYPE donation_status AS ENUM ('pending', 'successful', 'failed', 'refunded');
CREATE TYPE donation_type AS ENUM ('sadaqah', 'zakat', 'campaign', 'general');
CREATE TYPE rsvp_status AS ENUM ('rsvp', 'attended', 'canceled');
CREATE TYPE donor_tier AS ENUM ('standard', 'bronze', 'silver', 'gold', 'platinum');

-- 1. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role user_role DEFAULT 'community_member'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. roles
-- We will lean on the Enum `user_role` for access control strings, but roles table can track organizational role overrides if needed
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 3. members (Representing family/household links or congregants)
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  head_of_household_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
  relationship TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, head_of_household_id)
);

-- 4. donors
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  lifetime_total NUMERIC(12,2) DEFAULT 0 NOT NULL,
  tier donor_tier DEFAULT 'standard'::donor_tier NOT NULL,
  last_donation_date TIMESTAMPTZ
);

-- 5. campaigns (Prerequisite for donations)
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  goal_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) DEFAULT 0 NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. donations
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'MYR' NOT NULL,
  status donation_status DEFAULT 'pending'::donation_status NOT NULL,
  type donation_type DEFAULT 'general'::donation_type NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  payment_gateway_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. receipts
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  receipt_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  capacity INT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. audit_logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  record_id UUID NOT NULL,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================
-- Enabling RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Assuming InsForge provides a function `current_user_id()` mapping to the JWT token claim
-- users: Users can read own profile. Admins reading is handled by service roles.
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (id = current_setting('insforge.user_id', true)::uuid);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (id = current_setting('insforge.user_id', true)::uuid);

-- members: Access your own household data
CREATE POLICY "Members can read own household" ON public.members FOR SELECT USING (user_id = current_setting('insforge.user_id', true)::uuid OR head_of_household_id = current_setting('insforge.user_id', true)::uuid);

-- donations & receipts: Users can access their financial context
CREATE POLICY "Users can read own donations" ON public.donations FOR SELECT USING (user_id = current_setting('insforge.user_id', true)::uuid);
CREATE POLICY "Users can read own receipts" ON public.receipts FOR SELECT USING (EXISTS (SELECT 1 FROM public.donations WHERE id = public.receipts.donation_id AND user_id = current_setting('insforge.user_id', true)::uuid));

-- audit_logs: Only inserted automatically via triggers, never read directly except by Super Admins bypassing RLS
CREATE POLICY "Deny general access to audit logs" ON public.audit_logs FOR ALL USING (false);

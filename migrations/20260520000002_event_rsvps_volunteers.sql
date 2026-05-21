-- Masjid Portal Site - Phase 2 Extensions

-- 1. event_registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status rsvp_status DEFAULT 'rsvp'::rsvp_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- 2. volunteer_shifts
CREATE TABLE public.volunteer_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. rewards_inventory
CREATE TABLE public.rewards_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INT NOT NULL,
  stock_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. rewards_claims
CREATE TABLE public.rewards_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES public.rewards_inventory(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'pending' NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add reward_points to users
ALTER TABLE public.users ADD COLUMN reward_points INT DEFAULT 0 NOT NULL;

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own event registrations" ON public.event_registrations FOR SELECT USING (user_id = current_setting('insforge.user_id', true)::uuid);
CREATE POLICY "Users can register themselves" ON public.event_registrations FOR INSERT WITH CHECK (user_id = current_setting('insforge.user_id', true)::uuid);
CREATE POLICY "Users can read own shifts" ON public.volunteer_shifts FOR SELECT USING (user_id = current_setting('insforge.user_id', true)::uuid);
CREATE POLICY "Anyone can read rewards inventory" ON public.rewards_inventory FOR SELECT USING (true);
CREATE POLICY "Users can read own claims" ON public.rewards_claims FOR SELECT USING (user_id = current_setting('insforge.user_id', true)::uuid);

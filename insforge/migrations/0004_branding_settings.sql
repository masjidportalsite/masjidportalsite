-- Migration 0004: Branding Settings Schema

-- Create branding_settings table to support white-label multi-tenant styling
CREATE TABLE IF NOT EXISTS public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID, -- Optional foreign key depending on tenant schema
  site_name TEXT DEFAULT 'Masjid Portal',
  logo_url TEXT,
  secondary_logo_url TEXT,
  footer_logo_url TEXT,
  login_logo_url TEXT,
  favicon_url TEXT,
  social_share_image TEXT,
  primary_color TEXT DEFAULT '#10b981',
  secondary_color TEXT DEFAULT '#059669',
  accent_color TEXT DEFAULT '#3b82f6',
  background_color TEXT DEFAULT '#0f172a',
  text_color TEXT DEFAULT '#f8fafc',
  heading_font TEXT DEFAULT 'Inter',
  body_font TEXT DEFAULT 'Inter',
  font_size_scale NUMERIC DEFAULT 1.0,
  border_radius TEXT DEFAULT '0.5rem',
  shadow_intensity TEXT DEFAULT 'medium',
  sidebar_style TEXT DEFAULT 'default',
  header_style TEXT DEFAULT 'default',
  card_style TEXT DEFAULT 'default',
  navigation_style TEXT DEFAULT 'default',
  template_name TEXT DEFAULT 'Modern Islamic',
  custom_css TEXT,
  custom_announcement TEXT,
  sponsor_logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: No hard foreign key constraint on organization_id yet as the `organizations` table doesn't explicitly exist in the initial schema export, but is ready to act as the multi-tenant discriminator.

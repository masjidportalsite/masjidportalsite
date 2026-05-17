---
name: MasjidPortal
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404944'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#2d2e2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#434442'
  on-tertiary-container: '#b1b1ae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

# Brand & Style
The personality of this design system is defined by a "Digital Sanctuary" aesthetic—fusing the precision of modern SaaS engineering with the serenity and timelessness of spiritual architecture. It targets mosque administrators and community leaders who require professional-grade tools that feel respectful and inviting.

The style leverages **Minimalism** for functional areas to reduce cognitive load, while employing **Glassmorphism** and subtle textures for high-level dashboard elements to create depth. The interface should feel expensive yet humble, prioritizing clarity and ease of use through an Apple-inspired attention to detail and a Stripe-inspired commitment to clean typography.

## Colors
The color strategy centers on a "Rich Naturalism" palette. 

- **Primary Emerald (#064E3B):** Used for primary actions, navigation headers, and brand moments. It represents growth and tradition.
- **Gold Accent (#D4AF37):** Used sparingly for highlighting active states, premium features, or celebratory indicators. It should never be used for large blocks of text.
- **Cream Background (#FAF9F6):** A warm, high-end alternative to pure white that reduces eye strain and feels more welcoming.
- **Neutral Palette:** Deep charcoals and soft greys are used for body text and secondary UI elements to maintain high legibility without the harshness of pure black.

## Typography
This design system utilizes **Geist** for its technical precision and clean, humanist letterforms. The typographic hierarchy is built on "Generous Breathability."

- **Tracking:** Headings use negative tracking (-0.01em to -0.02em) for a tight, professional look, while body text and labels use increased tracking (0.01em to 0.1em) to enhance legibility and a sense of premium space.
- **Contrast:** Use font weight to differentiate hierarchy rather than just size. Labels are often semi-bold and all-caps to denote secondary metadata or section headers.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Dashboards utilize a fluid 12-column grid with a maximum content width of 1440px to ensure the interface remains manageable on ultra-wide monitors.

- **Rhythm:** An 8px linear scale drives all padding and margins. 
- **White Space:** Information density should be low to moderate. Emulate the "Apple" approach by adding 20% more padding than functionally necessary to evoke a sense of luxury and calm.
- **Sectioning:** Use large `xl` spacing to separate major content blocks, creating clear mental boundaries for the user.

## Elevation & Depth
Depth is created through a combination of **Glassmorphism** and high-diffusion shadows.

- **Surfaces:** Main content containers use the Cream background. Floating panels and cards use a semi-transparent white (rgba(255, 255, 255, 0.7)) with a `24px` backdrop-blur and a subtle `1px` stroke in `glass_stroke`.
- **Shadows:** Use "Deep Soft" shadows. Instead of harsh black, use a low-opacity Emerald tint (e.g., `rgba(6, 78, 59, 0.04)`) with a high blur radius (40px+) to make elements feel like they are softly levitating.
- **Patterns:** Apply a low-opacity (2-4%) Islamic geometric pattern (Star or Arabesque) to the background of the primary container or sidebar to provide cultural texture without distracting from content.

## Shapes
The shape language is "Organic Geometric." 

- **Corner Radii:** Standard cards and containers use a `24px` (rounded-xl) radius to feel modern and friendly. Small components like buttons use `12px` (rounded-lg).
- **Icons:** Use a medium-weight line icon set with rounded terminals. Avoid sharp corners in any illustrative or iconographic elements.
- **Interactive States:** On hover, buttons and cards should subtly scale (1.02x) rather than just changing color, reinforcing a tactile, physical feeling.

## Components
- **Buttons:** Primary buttons are Solid Emerald with White text. Secondary buttons use a Gold border with Gold text. Tertiary buttons are Ghost-style with Emerald text.
- **Cards:** The signature component. These must feature the glassmorphism effect, a 1px soft emerald border, and the Deep Soft shadow. Use them for prayer times, donation totals, and member profiles.
- **Input Fields:** Use a subtle cream-to-white gradient fill. The focus state should feature a 2px Gold outer glow to signify "sacred" focus.
- **Progress Bars:** Used for fundraising goals. The track should be a light emerald tint, and the filler should be a Gold-to-Emerald horizontal gradient.
- **Chips/Badges:** Use highly rounded (pill-shaped) backgrounds with low-opacity tints of the status color (e.g., soft red for "Overdue").
- **Specialty Components:** 
    - *Qibla Indicator:* A stylized, minimal compass integrated into the dashboard.
    - *Prayer Time Card:* A specialized glass card that highlights the "Active" prayer time using a subtle Gold glow effect.

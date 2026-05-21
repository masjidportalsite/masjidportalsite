---
title: UI/UX Standards
domain: frontend
status: active
priority: medium
tags:
  - design
  - sanctuary
last_updated: 2026-05-20
---

# UI/UX Standards: Masjid Portal

Design guidelines for the "Digital Sanctuary" experience.

## Visual Language
- **Rounded Corners**: 12px min for cards, 99px for buttons (pill-shaped).
- **Glassmorphism**: Use `backdrop-blur-md` on navigation and overlays.
- **Islamic Geometry**: Subtle background patterns (Emerald theme).

## Color Palette (Emerald & Gold)
- **Primary**: Emerald (`#003527`)
- **Accent**: Gold (`#fed65b`)
- **Background**: Soft White (`#f8f9ff`)

## Navigation Patterns
- **Desktop**: Persistent left sidebar.
- **Mobile**: Bottom navigation bar for "core" actions + Hamburger for "admin" tools.

## Interactive Feedback
- **Active State**: Subtle scale reduction (`active:scale-95`).
- **Loading**: Skeleton loaders matched to component dimensions.
- **Success/Error**: Toast notifications with high-contrast colors.

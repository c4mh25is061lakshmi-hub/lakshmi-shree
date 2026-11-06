---
name: Academic Operations System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-metric:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for comprehensive higher education institutions, academic registries, and student success command centers. The interface communicates institutional rigor, analytical clarity, and modern velocity. It addresses administrators, faculty heads, advisors, and students who require high-density data readability without cognitive fatigue.

The design movement combines **Corporate Modern** with **Technical Precision**:
- **Structured Precision**: High-density utility, clear modular segmentation, and strict grid discipline.
- **Calm Authority**: Deep slate and navy tones establish institutional gravitas, counterbalanced by vibrant, purposeful status signals.
- **High-Scannability**: Eliminates decorative ornamentation; data visualization, tabular metrics, and progress gauges serve as the visual centerpieces.

## Colors

The palette establishes a high-contrast, professional baseline with definitive semantic accents:

- **Primary (`#4F46E5` - Electric Indigo)**: Primary actions, active navigation states, interactive highlights, and focal KPI markers.
- **Secondary (`#0F172A` - Deep Slate Navy)**: Headers, primary body typography, dark contextual sidebars, and high-impact structural containers.
- **Tertiary (`#10B981` - Emerald Green)**: Passing grades, target attendance benchmarks, verified transcripts, and positive financial settlements.
- **Neutral (`#64748B` - Slate)**: Supporting text, subtle borders, table headers, and dormant status indicators.
- **Semantic Signals**:
  - **Warning / Alert (`#F59E0B` - Amber)**: Academic probation warnings, incomplete submissions, pending prerequisite checks.
  - **Critical (`#EF4444` - Rose)**: Course failures, registration holds, severe absenteeism, payment defaults.
- **Surface Roles**:
  - `surface-canvas`: `#F8FAFC` (Cool slate tint to minimize screen glare).
  - `surface-card`: `#FFFFFF` (Pure white for elevated contrast cards).
  - `border-subtle`: `#E2E8F0` (Crisp separation lines for tables and widgets).
  - `border-strong`: `#CBD5E1` (Interactive form borders and structural delimiters).

## Typography

The type scale combines **Plus Jakarta Sans** for expressive, modern headings with **Inter** for dense, legible operational bodies. 

- **Tabular Alignment**: All instances of student GPAs, grade percentiles, attendance counts, credits, and schedule timestamps must render with `font-feature-settings: 'tnum' 1` enabled to ensure vertical column alignment across dense registers.
- **Hierarchy Ratios**: Header weights peak at 700 to establish quick landmark identification in dashboard overviews. Body typography maintains 400 for long-form syllabi notes and evaluation remarks, stepping up to 500 and 600 for column headers, tags, and interactive labels.

## Layout & Spacing

The system runs on a **12-column responsive fluid grid** with strict multi-device adaptation:

- **Desktop (≥1280px)**: 12 columns, 24px (`gutter`) column gaps, 40px (`margin-lg`) canvas padding. Layout holds a collapsible 260px administrative rail and a dynamic 12-column widget workspace.
- **Tablet (768px - 1279px)**: 8 columns, 16px (`gutter-sm`) gaps, 24px (`margin`) margins. Side navigation compresses into a persistent icon bar or bottom app drawer. Multi-column metric rows break into 2x2 grids.
- **Mobile (<768px)**: 4 columns, 16px (`gutter-sm`) gutters, 16px (`margin-sm`) margins. Dense data tables switch to stacked card layouts with horizontal swipe mechanisms for metric segments.
- **Rhythm Rules**: Internal card and widget padding strictly utilizes `space-md` (16px) for high-density tools and `space-lg` (24px) for overview dashboard summaries. Metric blocks utilize `space-xs` (4px) to bind titles to numerical readouts.

## Elevation & Depth

Visual depth is achieved through **low-contrast outlines layered over minimal ambient shadows**:

- **Card Level (Default)**: `border: 1px solid #E2E8F0`, accompanied by an ambient shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05)`. This retains structural definition on `#F8FAFC` backgrounds without muddying content borders.
- **Active / Interactive Hover**: Card elements transition to `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)` with `border-color: #CBD5E1`.
- **Flyouts, Menus & Tooltips**: Surface `#FFFFFF`, `border: 1px solid #E2E8F0`, shadow `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Modals & Drawers**: Backdrop tint `rgba(15, 23, 42, 0.5)` with `backdrop-filter: blur(4px)`. Modals display elevated shadow `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

## Shapes

The interface implements a **Soft (Level 1)** geometric standard to balance contemporary polish with institutional stability:

- **Base Radius (`0.25rem` / 4px)**: Checkboxes, badges, micro-metric pills, table tags, and inline code elements.
- **Component Radius (`0.5rem` / 8px)**: Standard buttons, text inputs, dropdown selects, and pagination items.
- **Container Radius (`0.75rem` / 12px)**: Modular widgets, modal containers, data tables, and quick-stat cards.
- **Full Radius (Pill / 9999px)**: Reserved strictly for standalone status pills, user avatars, and circular progress bar tracks.

## Components

- **Buttons**:
  - *Primary*: Background `#4F46E5`, text `#FFFFFF`, border-radius 8px. Hover: `#4338CA`.
  - *Secondary*: Background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`. Hover: `#F8FAFC`.
  - *Destructive*: Background `#FEE2E2`, text `#B91C1C`, border `1px solid #FECACA`. Hover: `#EF4444`, text `#FFFFFF`.
- **KPI Stat Cards**:
  - White container with 12px radius, subtle border. Includes tabular large metric (e.g., `3.84 GPA`, `94.2% Attendance`), trend delta with directional arrow, and a horizontal 4px linear progress indicator tinted according to status (Emerald, Amber, Rose).
- **Data Tables**:
  - Header row: `#F8FAFC` background, 11px uppercase label font in `#64748B`, height 40px, bottom border `#E2E8F0`.
  - Data rows: `#FFFFFF`, height 52px, text 14px `#0F172A`, bottom border `#F1F5F9`. Hover state: `#F8FAFC`.
  - Number fields right-aligned with tabular font feature activated.
- **Status Badges & Chips**:
  - Compact padding (`2px 8px`), 4px border radius.
  - *Passing / On Track*: `#ECFDF5` background, `#065F46` text, `1px solid #A7F3D0`.
  - *Warning / Review*: `#FFFBEB` background, `#92400E` text, `1px solid #FDE68A`.
  - *Alert / Probation*: `#FEF2F2` background, `#991B1B` text, `1px solid #FECACA`.
- **Inputs & Form Controls**:
  - Height 40px, border `1px solid #CBD5E1`, border-radius 8px. Focused state: border `#4F46E5`, ring `3px rgba(79, 70, 229, 0.15)`. Placeholder color `#94A3B8`.
- **Checkboxes & Radios**:
  - Size 16px, border `1px solid #CBD5E1`. Checked state: `#4F46E5` fill with pure white icon indicator.
- **Modular Widgets**:
  - Standardized header area with `headline-sm` title, action overflow menu button, and optional secondary filter tabs. Divider-free transitions leading directly into tabular data or visualized charts.
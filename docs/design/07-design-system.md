---
tags: ['pellito-hub', 'design', 'design-system']
status: active
source: stitch_pellito_hub_kitchen_ux/
last_updated: 2026-04-29
---

# 07 — Design System: Coastal Industrial Utility

Derived directly from the Stitch export at `C:\Users\Owner\.claude\websites\Pellito Hub\stitch_pellito_hub_kitchen_ux\`. This is the authoritative spec for Pellito Hub UI implementation. The stitch HTML files are ground truth; this doc resolves inconsistencies across them into one canonical standard.

---

## 1. Brand Narrative

**Coastal Industrial Utility** — the synthesis of rugged maritime durability and high-performance kitchen utility. The aesthetic evokes a professional galley: organized, indestructible, and refreshing. The balance is **Minimalism** with **Bold Utility**, grounded in heavy-duty structural elements softened by a sophisticated nautical palette.

The target audience is hardworking kitchen staff who need immediate legibility under intense conditions (heat, steam, movement). The UI delivers a "Crisp and Refreshing" feel — like a cold breeze on a humid deck — while maintaining the reliability of industrial equipment. Visuals reference weathered metal, ship-lap structures, and high-visibility markings.

**Light mode only.** The system defaults to high-contrast light mode to minimize glare and maximize clarity on stainless-steel-mounted tablets and personal phones.

---

## 2. Color Palette

### Primary Tokens

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#3a5273` | Deep Navy — primary text actions, active states, structural anchors |
| `primary-container` | `#526a8d` | Coastal Blue — primary buttons, header fills, active nav items |
| `on-primary` | `#ffffff` | Text/icons on primary fills |
| `on-primary-container` | `#dfeaff` | Text/icons on primary-container fills |
| `background` / `surface` | `#f9f9ff` | Page background — near-white with a faint blue tint |
| `on-background` / `on-surface` | `#001b3c` | Body text on light backgrounds |
| `on-surface-variant` | `#43474e` | Secondary text, captions, metadata |
| `surface-container` | `#e7eeff` | Cards, elevated containers |
| `surface-container-low` | `#f0f3ff` | Subtle row alternation, hovered states |
| `surface-container-lowest` | `#ffffff` | Pure white — inputs, card interiors |
| `outline` | `#74777f` | Borders on inactive elements |
| `outline-variant` | `#c4c6cf` | Dividers, subtle separators |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#b7102a` | Heritage Red — critical alerts, LOW STOCK status, error emphasis |
| `tertiary` | `#27585a` | Sea Foam — CORRECT answer states, FRESH READY status |
| `tertiary-container` | `#417173` | Sea Foam container fills (CORRECT badges) |
| `error` | `#ba1a1a` | Error states, validation failures |
| `error-container` | `#ffdad6` | Error message backgrounds |

### Derived Surface Tones

| Token | Hex |
|---|---|
| `surface-dim` | `#c8dbff` |
| `surface-container-high` | `#dee8ff` |
| `surface-container-highest` | `#d5e3ff` |
| `surface-variant` | `#d5e3ff` |
| `inverse-surface` | `#183153` |
| `inverse-on-surface` | `#ecf1ff` |

---

## 3. Typography

Two fonts. Both from Google Fonts.

| Role | Family | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `headline-lg` | Space Grotesk | 700 | 40px | 1.1 | -0.02em |
| `headline-md` | Space Grotesk | 600 | 28px | 1.2 | -0.01em |
| `label-caps` | Space Grotesk | 700 | 14px | 1 | 0.1em |
| `body-lg` | Inter | 400 | 18px | 1.6 | 0 |
| `body-md` | Inter | 400 | 16px | 1.5 | 0 |

**Rules:**
- All labels, button text, nav items, and metadata → Space Grotesk, uppercase, tracked out
- All recipe body copy, ingredient descriptions, step prose → Inter
- Minimum readable size: 16px (never smaller for cook-facing content)
- Section headings use `UPPERCASE TRACKING-TIGHT` via Space Grotesk

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

---

## 4. Shape & Borders

**Square corners everywhere.** `border-radius: 0` on all containers, buttons, inputs, and cards. The only exception: circular FAB button uses `rounded-full`.

**Border language:**
- `border-2 border-[#001b3c]` — Heavy-duty structural border (Deep Navy). Cards, containers, key UI blocks.
- `border-2 border-[#526a8d]` — Coastal Blue utility border. Header accent, active input focus, section separators.
- `border-b-2 border-[#001b3c]` — Bottom divider (top app bar, section rules).
- `border-b-2 border-[#526a8d]` — Blue bottom divider (recipe list header).

**No drop shadows.** Depth is communicated through bold borders and tonal layers only. Active/"pressed" states use `active:translate-y-[2px] active:translate-x-[2px]` offset, not a shadow change.

---

## 5. Spacing

Base unit: 4px. Touch target minimum: 64px.

| Token | Value |
|---|---|
| `unit` | 4px |
| `stack-sm` | 8px |
| `stack-md` | 16px |
| `gutter` | 24px |
| `stack-lg` | 32px |
| `margin` | 32px |

---

## 6. Canonical Components

### 6.1 Top App Bar (CANONICAL — resolves stitch inconsistencies)

**One top bar across all screens.** The stitch files show 6+ variations; this resolves to one standard.

```
┌─────────────────────────────────────────────────────┐
│ [←/≡]  PELLITO HUB                        EN | ES  │
└─────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `#ffffff` (white) |
| Bottom border | `border-b-2 border-[#001b3c]` |
| Height | `h-[64px]` |
| Position | `fixed top-0 z-50` |
| Left slot | Back arrow (`arrow_back`) on drill-down pages; Hamburger (`menu`) on top-level pages |
| Title | `"PELLITO HUB"` — Space Grotesk, font-black, uppercase, text-[#001b3c] |
| Right slot | `"EN | ES"` — Space Grotesk, font-bold, uppercase, text-[#526a8d] (future: language toggle button) |
| Icon color | `text-[#001b3c]` |

**Manager variant (right slot):** Add circular avatar `w-10 h-10 border-2 border-[#001b3c] rounded-full` after the EN|ES toggle.

**Active recipe list (cook):** Top bar background stays white. The stitch `admin_recipe_list_updated` used a filled coastal-blue header — this is the outlier, superseded by the white standard.

### 6.2 Bottom Navigation Bar — Line Cook

4 tabs, fixed bottom, 80px height.

| Tab | Icon | Route |
|---|---|---|
| Dashboard | `dashboard` | `/dashboard` |
| Recipes | `restaurant_menu` | `/dashboard` (recipe list) |
| Quizzes | `quiz` | `/quiz` |
| Settings | `settings` | `/settings` |

Active tab: `bg-[#526a8d] text-white`. Inactive: `text-[#001b3c] hover:bg-[#f0f3ff]`.

```css
nav: fixed bottom-0 w-full h-[80px] bg-white border-t-2 border-[#001b3c] flex justify-around
tab: flex-col items-center justify-center flex-1 h-full
```

### 6.3 Bottom Navigation Bar — Manager

4 tabs, same structure.

| Tab | Icon | Route |
|---|---|---|
| Dashboard | `grid_view` | `/admin` |
| Admin View | `edit_note` | `/admin/recipes` |
| Role View | `person` | `/admin/recipes` (cook preview mode) |
| Settings | `settings` | `/admin/settings` |

### 6.4 Buttons

**Primary action:**
```
bg-[#526a8d] text-white border-2 border-[#001b3c]
min-h-[64px] font-label-caps uppercase tracking-[0.1em]
active:translate-y-[2px] active:translate-x-[2px]
```

**Secondary / ghost:**
```
bg-transparent text-[#001b3c] border-2 border-[#001b3c]
min-h-[64px] font-label-caps uppercase
hover:bg-[#f0f3ff]
```

**Destructive (Heritage Red):**
```
bg-[#b7102a] text-white border-2 border-[#001b3c]
```

No rounded corners on buttons (`rounded-none`).

### 6.5 Input Fields

```
h-[64px] w-full bg-white border-b-2 border-[#001b3c]
px-4 font-label-caps text-on-surface placeholder:text-[#74777f]/50
focus:border-2 focus:border-[#526a8d] outline-none
```

Large touch target (64px). Border-bottom only on default; full 2px box on focus. No rounded corners.

### 6.6 Recipe Card — Cook View

Used in `/dashboard` recipe list. Card is an `<article>` block.

```
bg-white border-2 border-[#001b3c] flex flex-col overflow-hidden
```

Structure:
1. **Image** `h-56 relative` — prep time badge top-right (label-caps, tertiary-container bg)
2. **Status dot** — `w-3 h-3` square + label-caps text (FRESH READY = green, LOW STOCK = secondary red)
3. **Title** — headline-md, on-surface, uppercase
4. **Description** — body-md, on-surface-variant, line-clamp-2
5. **Footer** — `bg-surface-container-low border-t-2 border-[#001b3c]` — portions count left, VIEW OPS button right

### 6.7 Recipe Card — Manager Admin View

Wider horizontal layout for list management.

```
bg-white border-2 border-[#001b3c] flex flex-col md:flex-row h-auto md:h-80
```

Left 40%: image with station badge. Right 60%: title, description (italic, border-l-4 border-primary-container), EDIT RECIPE button.

### 6.8 Execution Protocol Steps (Recipe Detail)

Numbered step cards from the recipe detail stitch.

```
border border-[#74777f] bg-white p-6 flex flex-col gap-2
hover:border-[#526a8d] transition-colors relative
```

- Step number: `absolute top-4 right-6 text-xl font-bold text-[#526a8d] opacity-30 group-hover:opacity-100`
- Step title: `text-lg font-bold uppercase tracking-tight`
- Step body: `text-sm font-medium leading-relaxed text-[#43474e]`

### 6.9 Ingredient Row

```
py-3 border-b border-[#74777f]/30 flex justify-between items-center px-2
```

- Ingredient name: `font-medium`
- Quantity badge: `font-bold text-xs bg-surface-container border border-[#74777f] px-2 py-1`

### 6.10 Pellito Chat FAB

```
fixed bottom-[100px] right-6 w-16 h-16 bg-[#526a8d] text-white
rounded-full border-2 border-white/20 flex items-center justify-center
active:scale-95 z-50
```

Icon: `forum` (filled variation).

### 6.11 Quiz Answer Button (4 options)

```
border-2 border-[#183153] bg-surface p-6 flex items-center gap-4
hover:bg-surface-container-low text-left
```

Letter badge: `w-12 h-12 border-2 border-[#183153] flex items-center justify-center font-label-caps`

**Selected state:** `bg-[#526a8d] text-white border-[#001b3c]`

**Correct state (post-submit):** `bg-[#27585a] text-white` (tertiary / sea foam)

**Wrong state (post-submit):** `bg-[#b7102a] text-white` (heritage red)

### 6.12 Metric Tile (Manager Dashboard)

```
border-2 border-[#001b3c] bg-white p-6 flex flex-col justify-between min-h-[180px]
box-shadow: 4px 4px 0px 0px #001b3c  /* industrial-border class */
```

Featured/inverted tile: `bg-[#526a8d] text-white` with same border/shadow.

### 6.13 Category Filter Chips

```
px-6 py-2 font-label-caps border-2 border-[#001b3c]
```

Active: `bg-[#526a8d] text-white`
Inactive: `bg-white text-[#001b3c] hover:bg-[#f0f3ff]`

---

## 7. Layout Rules

- **Viewport minimum:** 375px width (iPhone SE)
- **Content max-width:** `max-w-4xl` on cook screens, `max-w-6xl` on manager screens
- **Top padding:** `pt-[64px]` to clear fixed top bar
- **Bottom padding:** `pb-[160px]` on cook detail screens (bottom nav + FAB), `pb-[100px]` on list screens
- **Side margin:** `px-6` mobile, `px-8` tablet+
- **Background pattern (optional):** `radial-gradient(#3a5273 1px, transparent 1px); background-size: 24px 24px` at `opacity-[0.03]` — subtle dot grid, fixed overlay, pointer-events-none

---

## 8. Icon System

Material Symbols Outlined (variable font).

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

Default settings: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`

Filled variant (active nav icons): `font-variation-settings: 'FILL' 1, ...`

Key icons used:
- Navigation: `dashboard`, `restaurant_menu`, `quiz`, `settings`, `grid_view`, `edit_note`, `person`
- Actions: `search`, `filter_list`, `add`, `edit`, `delete`, `upload_file`, `publish`
- Recipe: `timer`, `outdoor_grill`, `restaurant`
- Pellito chat: `forum` (filled)
- Auth: `anchor`, `key`, `login`, `logout`
- Status: `check_circle`, `warning`, `error_outline`

---

## 9. Screen Inventory

### Line Cook Screens

| Screen | Stitch file | Route | Notes |
|---|---|---|---|
| Login — Mobile | `cook_login_1` | `/login` | Industrial form, image with coastal overlay, border-l-8 brand accent |
| Login — Simplified | `cook_login_2` | `/login` | Centered form, bg image 15% opacity, language toggle footer |
| Login — Desktop | `cook_login_desktop` | `/login` | Wider layout, role tabs (not built for prototype) |
| Logout / Shift End | `cook_log_out` | `/logout` | "Shift Complete" card, LOG OUT + BACK TO KITCHEN buttons, summary tiles |
| Recipe List | `admin_recipe_list_updated` | `/dashboard` | "GALLEY CONTROL" heading, search, horizontal category chips, 3-col card grid |
| Recipe Detail | `recipe_detail_classic_cheeseburger_optimized` | `/dashboard/[id]` | Hero image, utility details grid, ingredient list, execution protocol, quiz CTA |
| Quiz Question | `quiz_question_cook_view` | `/quiz/[recipeId]` | Progress header, question card with recipe image, 2×2 answer grid (A/B/C/D), SUBMIT |
| Quiz Results | `quiz_results_cook_view` | `/quiz/[recipeId]/results` | Score, mistake review, Back to Recipes / Try Hard Mode, full breakdown table |

### Manager Screens

| Screen | Stitch file | Route | Notes |
|---|---|---|---|
| Manager Dashboard | `manager_dashboard` | `/admin` | 3-col metric bento, bar chart sessions/day, image banner |
| Recipe Library (Role View) | `manager_recipe_library` | `/admin/recipes?view=role` | Same grid as cook view, START QUIZ buttons, no edit controls |
| Recipe List (Admin View) | `admin_recipe_list_admin_view` | `/admin/recipes` | Horizontal cards, EDIT RECIPE button, NEW RECIPE + IMPORT CSV action bar |
| Recipe Editor | `recipe_editor` | `/admin/recipes/[id]/edit` | Title, image, station chips, prep time, ingredients list, method steps, Save & Publish FAB |
| CSV Import | `csv_import_manager` | `/admin/import` | Drop zone, system specs sidebar, upload history table |
| Settings | `manager_settings` | `/admin/settings` | Under development placeholder, forthcoming features grid |

---

## 10. Background Decoration

Several screens use a subtle repeating dot grid:
```css
background-image: radial-gradient(#3a5273 1px, transparent 1px);
background-size: 24px 24px;
opacity: 0.03;
position: fixed;
inset: 0;
pointer-events: none;
z-index: -1;
```

Login screens use a faint brewery/industrial background photo at `opacity-15 saturate-50`.

---

## 11. Interaction Patterns

- **Press feedback:** `active:translate-y-[2px] active:translate-x-[2px]` (no shadow change). For cards with box-shadow: `active:translate-y-[4px] active:translate-x-[4px] active:shadow-none`.
- **Hover on cards:** `hover:border-[#526a8d]` (swap border to Coastal Blue). `transition-colors duration-200`.
- **Active nav tab:** Filled Coastal Blue (`bg-[#526a8d] text-white`) on the active tab. The icon switches to FILL 1 variant.
- **Search input focus:** Bottom border expands from 2px to full 2px box, border color switches to `#526a8d`.
- **Category chip active:** Filled Coastal Blue. Inactive chips show white with Deep Navy border.
- **Toast / auto-save:** `bg-primary-container text-on-primary-container border-2 border-[#526a8d]/30 flex items-center gap-3` with cloud_done icon.

---

## 12. Known Design Inconsistencies (Resolved Here)

The stitch files contain several inconsistencies introduced across iterations. This section records the resolution.

| Inconsistency | Stitch variation | Canonical resolution |
|---|---|---|
| Top app bar background | White, slate-50, or filled Coastal Blue (#526a8d) depending on screen | **White (`#ffffff`)** on all screens |
| Top app bar border color | `border-slate-900`, `border-blue-900`, `border-[#526a8d]`, `border-[#1B2B44]` | **`border-[#001b3c]`** (Deep Navy) on all screens |
| Primary color value | `#526A8D` vs `#3a5273` used inconsistently | **`#3a5273`** is `primary`. **`#526a8d`** is `primary-container`. Button fills use `#526a8d`. |
| Border radius | `0px`, `0.25rem`, `4px` across screens | **`0px`** — fully square corners everywhere (except `rounded-full` FAB) |
| Bottom nav height | 64px vs 80px | **80px** (`h-[80px]`) |
| Header title text | "PELLITO HUB", "GALLEY CONTROL", "GALLEY RECIPES", "LINE COOK" | **"PELLITO HUB"** on all screens. Page-specific context via breadcrumb or page heading inside `<main>` |
| Manager bottom nav labels | "Admin View / Role View" vs "Admin / Roles" | **"Admin View"** and **"Role View"** |
| Box shadow on metric tiles | `4px 4px 0px 0px #191c20` (some screens) | Retain this for manager dashboard metric tiles only — it reads as industrial depth without being skeuomorphic |

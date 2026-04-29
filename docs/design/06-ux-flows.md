---
tags:
  - pellito-hub
  - design
  - ux
status: active
source: stitch_pellito_hub_kitchen_ux/
last_updated: 2026-04-29
---

# 06 — UX Flows (Pellito Hub)

Mobile-first. Phone is the primary target (375px minimum). Design system: **Coastal Industrial Utility** — see `design/07-design-system.md` for full token and component spec.

Stitch source files: `C:\Users\Owner\.claude\websites\Pellito Hub\stitch_pellito_hub_kitchen_ux\`

---

## Information Architecture

```
/login                          ← shared entry point
│
├── LINE COOK SESSION (role: linecook)
│   ├── /dashboard              ← recipe list (search + filter)
│   │   └── /dashboard/[id]     ← recipe detail → quiz CTA
│   ├── /quiz/[recipeId]        ← quiz question (easy → hard)
│   │   └── /quiz/[recipeId]/results
│   ├── /settings               ← stub (V2+)
│   └── /logout
│
└── MANAGER SESSION (role: admin)
    ├── /admin                  ← dashboard metrics
    ├── /admin/recipes          ← recipe list (admin view with edit controls)
    │   ├── /admin/recipes/new
    │   └── /admin/recipes/[id]/edit
    ├── /admin/import           ← CSV import manager
    └── /admin/settings         ← stub (V2+)
```

---

## Navigation Shell

### Line Cook Bottom Nav

4 tabs, fixed bottom, 80px, `border-t-2 border-[#001b3c]`.

| Tab | Icon | Route | Active on |
|---|---|---|---|
| Dashboard | `dashboard` | `/dashboard` | `/dashboard` only |
| Recipes | `restaurant_menu` (filled when active) | `/dashboard` | `/dashboard`, `/dashboard/[id]` |
| Quizzes | `quiz` (filled when active) | `/quiz` | `/quiz/*` |
| Settings | `settings` | `/settings` | `/settings` |

### Manager Bottom Nav

| Tab | Icon | Route | Active on |
|---|---|---|---|
| Dashboard | `grid_view` | `/admin` | `/admin` |
| Admin View | `edit_note` | `/admin/recipes` | `/admin/recipes/*`, `/admin/import` |
| Role View | `person` | `/admin/recipes?view=role` | (cook-preview mode) |
| Settings | `settings` | `/admin/settings` | `/admin/settings` |

---

## Flow 1 — Employee Login

**Stitch:** `cook_login_1` (primary mobile), `cook_login_2` (simplified), `cook_login_desktop`

### Screen: Login (`/login`)

Two visual variants in stitch; implement the `cook_login_2` version as the canonical login — cleaner, faster to read.

**Layout:**
- Fixed full-height, centered vertically
- Faint brewery background image at `opacity-15 saturate-50` (fixed, z-behind)
- Top accent: `fixed top-0 left-0 w-full h-[3px] bg-[#526a8d]`
- Bottom accent: `fixed bottom-0 left-0 w-full h-[3px] bg-[#001b3c]`
- Dot-grid background pattern at `opacity-[0.05]`

**Content block** (max-w-[480px], centered):
1. **Brand header:** "PELLITO HUB" display-lg, uppercase, `text-[#526a8d]`; subline "Pellito the Deckhand — Training Portal" label-md, uppercase, tracked
2. **Form card:** `bg-white/80 backdrop-blur-md border-2 border-[#001b3c]`
   - Label: "Role Credentials" font-label-lg uppercase
   - Password input: `h-[80px]` full-width, `tracking-[0.5em]` for code entry feel, `font-display-lg`
   - Submit button: `h-[80px] w-full bg-[#526a8d] text-white font-headline-md uppercase`, text "Enter Kitchen", `anchor` icon
3. **Footer:** Border-t-4 Deep Navy
   - Status indicator: pulsing square `bg-[#526a8d]` + "Main Hot Line" + "Status: Terminal Active"
   - Language segmented control: 2-col grid, 64px height, "English" (filled) | "Español" (outline)

**Interaction:**
- Submit → `POST /api/auth/login` with `{ username: 'linecook', password: 'linecook' }`
- Success → redirect to `/dashboard`
- Failure → inline error message below input, `text-[#b7102a]`

---

## Flow 2 — Line Cook Recipe List

**Stitch:** `admin_recipe_list_updated` (the "GALLEY CONTROL" / cook recipe list view)

### Screen: Recipe List (`/dashboard`)

**Top App Bar:** White, `border-b-2 border-[#001b3c]`, height 64px
- Left: back arrow (hidden on this top-level screen, show hamburger instead) + "PELLITO HUB"
- Right: "EN | ES"

**Page content:**

1. **Search bar:**
   ```
   h-[64px] border-b-2 border-[#001b3c] pl-14 pr-6 font-headline-md
   placeholder: "SEARCH RECIPES..."
   left icon: search (Coastal Blue)
   right icon: filter_list (Coastal Blue)
   ```

2. **Category filter chips** (horizontal scroll, hide scrollbar):
   - ALL RECIPES (active: Coastal Blue fill)
   - One chip per `recipe_type` value from DB (Core, Specials)
   - Chips: `px-6 py-2 font-label-caps border-2 border-[#001b3c]`

3. **Recipe grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter`
   Each card (`article`):
   - Image `h-64` with prep time badge top-right (tertiary-container bg, label-caps)
   - Status dot (12px square) + status label: FRESH READY (green) / LOW STOCK (secondary red) / BULK READY (primary)
   - Title: `font-headline-md uppercase`
   - Description: `font-body-md text-on-surface-variant line-clamp-2`
   - Footer: `bg-surface-container-low border-t-2 border-[#001b3c]`, portions left, "VIEW OPS" button right

4. **Empty state:** Centered, anchor icon (large, muted), "No recipes found", subline matches search/filter context.

5. **Loading state:** Skeleton cards — `bg-surface-container animate-pulse`, same card dimensions.

**Data source:** `GET /api/recipes?status=published&search=...&type=...`

**Note on images:** The schema has no image field at this stage. Cook recipe cards omit the image section and use a Coastal Blue placeholder band in its place (`bg-[#526a8d]/10 h-32 border-b-2 border-[#001b3c]`) with the recipe type as a label.

---

## Flow 3 — Recipe Detail

**Stitch:** `recipe_detail_classic_cheeseburger_optimized`

### Screen: Recipe Detail (`/dashboard/[id]`)

**Top App Bar:** White, `border-b-2 border-[#526a8d]` (Coastal Blue — one deliberate divergence from Deep Navy for this screen's "active recipe" feeling), back arrow left, "PELLITO HUB" title, EN|ES right.

**Layout:** Single column, `max-w-4xl mx-auto px-6 pt-[64px] pb-[160px]`

**Section 1 — Utility Details Grid** (2-col on md+):
- **Station/Type tile:** `border border-[#001b3c] p-6 bg-surface-container` — recipe_type label in Coastal Blue label-caps, large uppercase recipe type value
- **Prep & Shelf Life tile:** `border border-[#001b3c] p-6 bg-white grid grid-cols-2`
  - PREP TIME: value + unit
  - SHELF LIFE: value (if present)
- **Yield / Plateware** shown as additional tiles if populated

**Section 2 — Ingredients** (`mb-12`):
- Section header: `text-xl font-bold uppercase border-l-4 border-[#526a8d] pl-4 mb-6`
- Each ingredient row: `py-3 border-b border-[#74777f]/30 flex justify-between px-2`
  - Name: `font-medium`
  - Quantity badge: `font-bold text-xs bg-surface-container border border-[#74777f] px-2 py-1`

**Section 3 — Cook Steps ("Execution Protocol")**:
- Section header: same border-l-4 style as ingredients
- Each step card: `border border-[#74777f] bg-white p-6 hover:border-[#526a8d] group relative`
  - Step number (1-indexed): `absolute top-4 right-6 text-xl font-bold text-[#526a8d] opacity-30 group-hover:opacity-100`
  - Step text: `text-sm font-medium leading-relaxed text-[#43474e]`

**Section 4 — Plate Steps** (if present, same pattern as cook steps, different header)

**CTA — Quiz:**
```
w-full bg-[#526a8d] text-white min-h-[64px] font-bold uppercase tracking-[0.1em]
border-b-4 border-[#3e4f6a] active:translate-y-[4px] active:border-b-0
text: "START RECIPE QUIZ"
```

**Pellito Chat FAB:**
```
fixed bottom-[100px] right-6 w-16 h-16 bg-[#526a8d] rounded-full
border-2 border-white/20 active:scale-95 z-50
icon: forum (FILL 1)
```

**Data source:** `GET /api/recipes/[id]`

---

## Flow 4 — Quiz

**Stitch:** `quiz_question_cook_view` (question), `quiz_results_cook_view` (results)

### Screen: Quiz Question (`/quiz/[recipeId]`)

**Top App Bar:** White, `border-b-2 border-[#001b3c]`, back arrow (exits to recipe detail), "LINE COOK" (page-specific title — exception to "PELLITO HUB" rule, retained here because it contextualizes the session), EN|ES right.

**Quiz header card:**
```
bg-[#526a8d] text-white p-4
left: "QUIZ SECTION: [RECIPE TYPE]" label-caps
right: "QUESTION 04/12" label-caps
```

**Question block** (`border-2 border-[#183153]`):
- Optional recipe image (left 1/3 on md+)
- Recipe name: label-caps, tertiary
- Question text: headline-md, on-surface, uppercase

**Answer grid** (`grid grid-cols-1 md:grid-cols-2 gap-stack-md`):
- 4 options (A/B/C/D)
- Unselected: `border-2 border-[#183153] bg-surface p-6 flex items-center gap-4`
- Letter badge: `w-12 h-12 border-2 border-[#183153]`
- Selected: `bg-[#526a8d] text-white`
- Post-submit correct: `bg-[#27585a] text-white`
- Post-submit wrong: `bg-[#b7102a] text-white`

**Action row:**
- Chef's Tip: `w-3 h-3 bg-[#27585a]` + label-caps text
- SUBMIT ANSWER button: `px-12 py-6 bg-[#526a8d] font-label-caps border-2 border-[#001b3c]`

**Flow logic:**
1. 5 easy questions generated from `recipe.cook_steps`, `recipe.ingredients`, `recipe.shelf_life`, `recipe.yield`, `recipe.plateware`
2. After 5/5 correct → offer 3 hard follow-up questions (optional)
3. After completing easy OR declining hard → redirect to results screen

### Screen: Quiz Results (`/quiz/[recipeId]/results`)

**Layout:** `max-w-6xl mx-auto pt-24 px-margin`

**Hero section** (full-width card, bg-surface-container-high, border-2 border-primary):
- Left: QUIZ COMPLETED badge (tertiary), "GREAT JOB!" headline-lg, score `4/5 Correct`
- Right: recipe image (optional, 256px wide, border-2 border-primary)

**Bento action grid** (`grid-cols-12`):
- Review Mistakes (col-span-7): error-container bordered list of wrong answers (your answer vs correct answer), RETAKE INCORRECT ITEMS button
- Side actions (col-span-5):
  - BACK TO RECIPES: `bg-[#526a8d] text-white`
  - TRY HARD MODE: `bg-white hover:bg-[#b7102a] hover:text-white`

**Full breakdown table:** `border-2 border-[#001b3c]`, thead `bg-[#001b3c] text-white`, each row shows Q-id, question text, CORRECT (tertiary) or INCORRECT (secondary red) badge.

---

## Flow 5 — Logout

**Stitch:** `cook_log_out`

### Screen: Logout (`/logout`)

Accessible from Settings tab (bottom nav). Confirmation screen, not a modal.

**Layout:** Centered vertically with bottom nav still visible.

**Status card** (`max-w-md border-2 border-[#001b3c] p-8`):
- Large check_circle icon (tertiary-container, FILL 1)
- "Shift Complete" headline-md
- "Excellent work today, Chef" body-md
- 2-col summary tiles: STATION | MODULES

**Action block:**
- "Ready to Departure?" label-caps, `text-[#b7102a]`
- LOG OUT button: `h-16 bg-[#526a8d] text-white border-2 border-[#001b3c]`
- BACK TO KITCHEN button: `h-16 bg-transparent border-2 border-[#001b3c]`

**Interaction:**
- LOG OUT → `POST /api/auth/logout` → redirect to `/login`

---

## Flow 6 — Manager Dashboard

**Stitch:** `manager_dashboard`

### Screen: Dashboard (`/admin`)

**Top App Bar:** White, `border-b-4 border-[#526a8d]` (4px blue — managerial authority signal), back arrow left (returns to — nowhere, this is top-level; hide back arrow, show menu/hamburger), "PELLITO HUB", EN|ES + avatar right.

**Page heading:** "Manager Dashboard" — text-4xl md:text-5xl font-bold uppercase; `h-1 w-24 bg-[#526a8d]` underline accent; "Training Analytics - Rolling 30 Days" subline.

**Metric bento grid** (`grid grid-cols-1 md:grid-cols-3 gap-6`):
1. **Most-missed questions:** Industrial-border card, `box-shadow: 4px 4px 0 0 #191c20`, question text + "Missed by X%" in error color
2. **Training completion %:** Industrial-border card, large number, progress bar (primary fill)
3. **Most-viewed recipes:** Inverted card (`bg-[#526a8d] text-white`), recipe title, view count

**Weekly chart:** Bar chart (CSS, no JS library needed at prototype) — bars are `bg-[#526a8d]`, labels are `text-[10px] uppercase`, container `border-2 border-[#001b3c]`.

**Pellito Chat FAB** (same as cook screens).

---

## Flow 7 — Manager Recipe Library

**Stitch:** `admin_recipe_list_admin_view` (admin view), `manager_recipe_library` (role/cook-preview view)

### Screen: Recipe List Admin View (`/admin/recipes`)

**Action bar** (above list):
- NEW RECIPE button: `bg-[#526a8d] text-white border-2 border-[#001b3c] shadow-[4px_4px_0_0_rgba(15,23,42,1)]`
- IMPORT CSV button: `bg-white border-2 border-[#001b3c]`

**Search + chips:** Same pattern as cook recipe list.

**Recipe cards:** Horizontal layout (`flex-row`), image left 40%, content right 60%, EDIT RECIPE button. Cards in a `flex flex-col gap-gutter` list (not a grid).

### Screen: Recipe Editor (`/admin/recipes/[id]/edit` or `/admin/recipes/new`)

**Stitch:** `recipe_editor`

**Top App Bar:** White, `border-b-2 border-[#526a8d]`, "← Back" left, "EN | ES" right.

**Auto-save toast** (top of content, on change):
```
bg-primary-container text-on-primary-container border-2 border-[#526a8d]/30
flex items-center gap-3 p-4
icon: cloud_done  text: "Auto-save: Active"  right: timestamp
```

**Form sections:**
1. Title input (`h-[56px]`, `border-2 border-[#8e9099]`, font-bold text-2xl)
2. Station chips (tag selector)
3. Prep time input (`w-24 h-[56px] text-center font-black text-xl`)
4. Ingredients list: draggable rows, each `h-[64px]` — drag_indicator icon, qty input, name input, delete button
5. Method steps: numbered step cards with textarea, "Set Alert" and "Add Photo" utility buttons, reorder arrows, delete

**Save & Publish FAB** (full-width, `fixed bottom-[96px]`):
```
w-full h-16 bg-[#526a8d] text-white font-black text-xl uppercase
icon: publish  text: "Save & Publish"
rounded-xl shadow-[0_4px_15px_rgba(82,106,141,0.4)]
```

---

## Flow 8 — CSV Import

**Stitch:** `csv_import_manager`

### Screen: CSV Import (`/admin/import`)

**Layout:** `grid grid-cols-1 md:grid-cols-12`

**Main area (col-span-8):**
- Drop zone: `border-2 border-dashed border-[#001b3c] min-h-[400px]` — upload_file icon, "Drop manifest file here", SELECT FILE FROM DISK button
- Action bar: validation status indicator (error square + "PENDING VALIDATION"), PROCESS CSV button (disabled until file loaded)

**Sidebar (col-span-4):** System specs panel with Coastal Blue header strip, FORMAT/DELIMITER/MAX ROWS specs, Download Template link.

**Upload History table:** `border-2 border-[#001b3c]`, ID / TIMESTAMP / FILENAME / RECORDS / STATUS columns, status badge (Success = tertiary / Failed = error).

---

## Flow 9 — Manager Settings

**Stitch:** `manager_settings`

### Screen: Settings (`/admin/settings`)

**Under development placeholder.** Header: border-l-4 accent, "Settings" headline-lg. Main card: "STATUS: UNDER DEVELOPMENT" tertiary badge + prose. Sidebar: grayscale image with "VISUAL LOG" Coastal Blue header. Forthcoming features grid: Permissions (locked), Alert Logs (pending), Visual Theme (staged), Data Export (queued).

---

## Design Rules to Carry Into Code

1. **Touch targets ≥ 64px** on all interactive elements that cook fingers will hit during service.
2. **No rounded corners** except the Pellito FAB.
3. **Deep Navy borders** (`#001b3c`) are structural — they belong on every card and container.
4. **Coastal Blue** (`#526a8d`) is for actions and active states — don't use it as a general border or text color.
5. **Heritage Red** (`#b7102a`) is for critical information only — errors, LOW STOCK, wrong answers. Don't repurpose it decoratively.
6. **Body text minimum 16px.** Label-caps at 14px is acceptable for metadata and badges only.
7. **Space Grotesk goes uppercase.** Every time Space Grotesk is used for UI text, it should be uppercase and tracked.
8. **Image dependency:** The schema has no image field at prototype. Substitute all recipe card images with a Coastal Blue textured placeholder until the schema and seed support it.
9. **Bottom nav is always visible** on cook screens. Never hide it inside a scroll area.
10. **The Pellito Chat FAB** lives at `bottom-[100px] right-6` — above the bottom nav, never overlapping it.

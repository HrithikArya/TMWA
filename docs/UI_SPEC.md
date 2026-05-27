# TaskFlow — UI Design Specification

---

## Design Philosophy

**Aesthetic**: Industrial-minimal dark-first. Clean, dense information display. Think Linear or Vercel dashboard energy — not a colorful toy app. This signals professional-grade frontend skills.

**Theme**: Dark by default. Light mode available. High contrast. Purposeful use of color only for semantic meaning (status, priority, actions).

---

## Color Tokens (Tailwind CSS Variables)

Add to `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background scale
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-overlay': 'var(--bg-overlay)',

        // Border scale
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',

        // Text scale
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-disabled': 'var(--text-disabled)',

        // Brand accent
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-muted': 'var(--accent-muted)',

        // Semantic
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'danger': 'var(--danger)',
        'info': 'var(--info)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### CSS Variables (`index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== DARK THEME (default) ===== */
:root {
  --bg-base: #0a0a0b;
  --bg-surface: #111113;
  --bg-elevated: #1a1a1f;
  --bg-overlay: #212128;

  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  --text-primary: #f0f0f2;
  --text-secondary: #a0a0ab;
  --text-muted: #6b6b76;
  --text-disabled: #3d3d45;

  --accent: #6366f1;        /* Indigo */
  --accent-hover: #818cf8;
  --accent-muted: rgba(99, 102, 241, 0.12);

  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
}

/* ===== LIGHT THEME ===== */
.light {
  --bg-base: #f8f8f9;
  --bg-surface: #ffffff;
  --bg-elevated: #f0f0f2;
  --bg-overlay: #e8e8ec;

  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.16);

  --text-primary: #0a0a0b;
  --text-secondary: #4b4b56;
  --text-muted: #8b8b96;
  --text-disabled: #c0c0c8;

  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-muted: rgba(79, 70, 229, 0.08);

  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
  --info: #2563eb;
}

* { box-sizing: border-box; }

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
```

---

## Page Layouts

### Auth Pages (Login / Signup)
```
Full screen centered card
- Left half (desktop): Brand panel with gradient + tagline
- Right half: Form card
- Mobile: Full width form only
Card max-width: 440px
```

### Dashboard
```
┌─────────────────────────────────────────────────────┐
│ NAVBAR (sticky) — logo | search | dark toggle | user │
├──────┬──────────────────────────────────────────────┤
│      │ STATS BAR — Total | Pending | Completed       │
│      ├──────────────────────────────────────────────┤
│ SIDE │ FILTER TABS — All | Pending | Completed       │
│  BAR │ + [+ New Task] button                         │
│      ├──────────────────────────────────────────────┤
│      │ TASK LIST (paginated grid — 1 col mobile,    │
│      │ 2 col tablet, 2 col desktop)                  │
│      │                                               │
│      │ PAGINATION controls                           │
└──────┴──────────────────────────────────────────────┘
```

### Task Card
```
┌─────────────────────────────────────────┐
│ [Priority Badge]              [•••menu] │
│                                         │
│ Task Title (font-semibold)              │
│ Description preview (2 lines max)       │
│                                         │
│ 📅 Jun 01  │  [status toggle chip]     │
└─────────────────────────────────────────┘
hover: border-color brightens, slight scale(1.01)
```

---

## Component Styling Guide

### Button Variants
```tsx
// Primary
className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-md transition-colors"

// Ghost
className="bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default px-4 py-2 rounded-md transition-colors"

// Danger
className="bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-4 py-2 rounded-md transition-colors"

// Icon only
className="p-2 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
```

### Priority Badges
```tsx
const priorityConfig = {
  high:   { label: 'High',   className: 'bg-danger/10 text-danger border-danger/20' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning border-warning/20' },
  low:    { label: 'Low',    className: 'bg-success/10 text-success border-success/20' },
};

// Badge base: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
```

### Status Toggle Chip
```tsx
// Pending
className="bg-warning/10 text-warning border border-warning/20 text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-warning/20 transition-colors"

// Completed  
className="bg-success/10 text-success border border-success/20 text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-success/20 transition-colors"
```

### Input Fields
```tsx
className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
```

### Modal
```tsx
// Overlay
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"

// Panel
className="bg-bg-surface border border-border-default rounded-xl w-full max-w-lg shadow-2xl animate-slide-up"
```

### Skeleton Loader
```tsx
className="bg-bg-elevated rounded animate-skeleton"
// Height varies per element being skeletonized
```

---

## Overdue Date Indicator

```tsx
const isOverdue = task.dueDate && 
  new Date(task.dueDate) < new Date() && 
  task.status !== 'completed';

// Apply to date text:
className={cn("text-xs", isOverdue ? "text-danger font-medium" : "text-text-muted")}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout change |
|---|---|---|
| mobile | < 640px | Single column, no sidebar, hamburger nav |
| tablet | 640–1024px | Two column task grid, sidebar collapsible |
| desktop | > 1024px | Full layout with permanent sidebar |

Use Tailwind defaults: `sm:`, `md:`, `lg:`, `xl:`.

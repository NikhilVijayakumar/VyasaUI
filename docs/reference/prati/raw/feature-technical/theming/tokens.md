# Design Tokens: Feature Technical

## 1. Technical Overview

Design tokens are the single source of truth for visual primitives — colors, spacing, and typography. Defined in `src/theme/tokens/` as TypeScript constants. Spacing uses a 4px base unit with semantic names (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `section`, `page`) mapped to multipliers. Color tokens define brand, background, text, and status categories with light/dark mode variants. Typography defines font families (Inter for sans, IBM Plex Mono for mono) and custom variants. Tokens are consumed by `ThemeProvider` via `createTheme()` and by components via `useTheme()` or direct imports from `prati`.

## 2. Architecture Realization

| Feature Spec Concept | Architecture Implementation |
|---|---|
| Base unit (4px) | `spacing.unit` exported from `src/theme/tokens/spacing.ts`, consumed as `theme.spacing(n)` |
| Semantic spacing tokens | `xs: 1` (8px), `sm: 1.5` (12px), `md: 2` (16px) — multiplier of base unit |
| Color roles | `palette.primary.main`, `palette.background.default`, `palette.text.primary`, `palette.error.main` |
| Light/dark variants | `createTheme({ palette: { mode: 'light' } })` and `createTheme({ palette: { mode: 'dark' } })` |
| Typography | `typography.fontFamily` from `src/theme/tokens/typography.ts` |
| Token imports | `import { spacing, typography } from 'prati'` |

**File locations:**

| Token Category | File |
|---|---|
| Colors | `src/theme/tokens/colors.ts` |
| Spacing | `src/theme/tokens/spacing.ts` |
| Typography | `src/theme/tokens/typography.ts` |
| Re-exports | `src/theme/index.ts` |

**Custom theme extension pattern:**

```typescript
import { createTheme } from '@mui/material/styles';
import { spacing, typography } from 'prati';

const appLightTheme = createTheme({
  palette: {
    primary: { main: brandColors.primary },
    background: { default: brandColors.backgroundLight, paper: brandColors.surface },
  },
  spacing: spacing.unit,
  typography: { fontFamily: typography.fontFamily },
});
```

## 3. Data Flow

```
Raw values in src/theme/tokens/colors.ts (hex strings)
       ↓
Exported as typed constants: export const colors = { primary: '#5A60F5' }
       ↓
Imported by ThemeProvider or createTheme() consumer
       ↓
MUI theme pipeline resolves tokens into theme.palette.*
       ↓
Components reference via useTheme() → theme.palette.primary.main
       ↓
Or via sx prop string path: sx={{ color: 'primary.main' }}
```

## 4. State Management

Tokens are static constant values — no runtime state. The only runtime variance is light vs dark mode resolution, managed by `ThemeProvider`:

| Variant | Active When |
|---|---|
| Light tokens | `darkMode === false` → `createTheme({ palette: { mode: 'light' } })` |
| Dark tokens | `darkMode === true` → `createTheme({ palette: { mode: 'dark' } })` |

Each color category (`background`, `text`) defines both light and dark mode values. Missing dark variant causes incorrect rendering in dark mode.

## 5. Styling Implementation

**Allowed patterns (per Theme Sovereignty invariant):**

| Pattern | Example |
|---|---|
| `sx` prop with token path | `sx={{ color: 'primary.main', mt: 2 }}` |
| `styled` with theme access | `styled('div')(({ theme }) => ({ padding: theme.spacing(2) }))` |
| Token constant import | `import { spacing } from 'prati'; const gap = spacing.lg;` |
| `useTheme()` for dynamic values | `const theme = useTheme(); const bg = theme.palette.error.light;` |

**Forbidden patterns (P0 — Critical):**

| Pattern | Violation |
|---|---|
| Hardcoded hex/rgb/hsl | `backgroundColor: '#1976d2'` |
| Hardcoded pixel spacing | `padding: '16px'` |
| Hardcoded font values | `fontSize: '14px', fontWeight: 600` |
| Raw CSS imports | `import './Component.css'` with design values |
| Local style constants | `const COLORS = { primary: '#...' }` |

## 6. Interaction Design

Tokens are static values — no interaction design. Components use tokens for visual feedback states (hover, active, disabled) via theme palette:

- Hover: `theme.palette.action.hover`
- Active: `theme.palette.action.active`
- Disabled: `theme.palette.action.disabled`
- Focus: `theme.palette.action.focus`

## 7. Accessibility Implementation

- Color tokens must maintain WCAG contrast ratios — not automatically verified (detection gap)
- Text/background pairings should use token combinations that guarantee sufficient contrast
- Status colors (error, warning, success, info) must be distinguishable in both light and dark modes
- Focus indicator colors must use theme tokens — `theme.palette.primary.main` for outline
- Token values should not be the sole differentiator for non-color-coded information

## 8. Error Handling

| Condition | Behavior |
|---|---|
| Missing token | Consumer references undefined name → runtime `undefined` value |
| Token collision | Duplicate semantic names across categories → silent override |
| Missing dark variant | Color category missing dark mode value → incorrect dark mode color |
| Invalid `createTheme` config | Malformed theme values → MUI theme creation error |
| Wrong import path | TypeScript compile error — caught at build time |

## 9. Performance Considerations

- Static constants — no runtime computation cost
- Theme object creation happens on mode switch (infrequent)
- MUI `sx` prop resolves token strings at runtime — `sx={{ color: 'primary.main' }}` is parsed and resolved
- Token values are plain primitives (strings, numbers) — minimal memory footprint
- Bundle size: token files are small (< 1KB each) — negligible impact

## 10. Integration Points

| Integration | Mechanism | File |
|---|---|---|
| Token definitions | TypeScript constants | `src/theme/tokens/colors.ts`, `spacing.ts`, `typography.ts` |
| ThemeProvider consumption | `createTheme({ palette: tokens })` | Consumer's `App.tsx` |
| Component consumption | `import { spacing } from 'prati'` or `useTheme()` | Any component |
| sx prop resolution | MUI theme pipeline | Runtime (MUI internal) |
| Brand customization | `createTheme` palette config at app root | Consumer's theme setup |
| Theme sovereignty linting | Detection heuristics for hardcoded values | Code review |

## 11. Open Questions

- Should tokens include shadow/elevation values, or is that component-specific?
- How should brand tokens be versioned to support multi-brand deployments?
- Should automated WCAG contrast ratio verification be added to CI?
- Should responsive spacing tokens scale with viewport breakpoints?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.

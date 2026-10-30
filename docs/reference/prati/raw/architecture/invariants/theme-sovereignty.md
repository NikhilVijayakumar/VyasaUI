# Theme Sovereignty Invariant

## Purpose

Prati is a theme-driven UI component library.

All visual styling must originate from Prati's theme token system. Design tokens (colors, spacing, typography) are the single source of truth for every component's appearance.

Components must not define their own raw style values. Every color, spacing unit, font size, border radius, and shadow must derive from the theme context or exported token constants.

Theme sovereignty guarantees:
- visual consistency across all consumers
- single-point theme customization
- light/dark mode parity
- design system evolvability
- consumer-brandable output

---

## Architectural Rule

Components must reference theme tokens exclusively for all visual properties.

A component may:
- use MUI's `sx` prop with theme token references
- use `styled` with theme function access
- import token constants from `prati/theme`
- reference `useTheme()` for dynamic values
- use token-based spacing, color, and typography

A component may NOT:
- hardcode hex/rgb/hsl color values
- hardcode pixel/rem/em spacing values
- define inline font sizes or families
- import external uncontrolled style systems
- define raw CSS custom properties for design values
- create component-local style constants that duplicate tokens

---

## Documented Exception: ThemeProvider Persistence

The following is a **single documented exception** to the theme sovereignty rule that is granted by the [Stateless UI Invariant](stateless-ui.md).

### ThemeProvider Dark Mode Preference

Prati's `ThemeProvider` may read and persist the user's `darkMode` preference via `localStorage`. This is not a theme token concern — it is a UX convenience for theme preference persistence that falls under the stateless UI invariant's documented exception.

Requirements:

- This exception applies exclusively to `ThemeProvider` — no other component may persist theme preferences
- The persisted value is UX preference state, not a design token
- All actual styling values must still come from theme tokens, not from persisted state
- See the [Stateless UI Invariant](stateless-ui.md) for the full exception details, SSR guard requirements, and JSDoc annotation requirements

---

## Allowed Patterns

### Theme-Aware Styled Components

Allowed:

```tsx
import { styled } from '@mui/material/styles';

const StyledCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

Reason:
All values derive from theme context.

---

### Token Import for Exported Constants

Allowed:

```tsx
import { spacing } from 'prati';

const gap = spacing.lg;
```

Reason:
Token constants provide a single source of truth.

---

### SX Prop With Theme References

Allowed:

```tsx
<Box
  sx={{
    color: 'primary.main',
    mt: 2,
    fontSize: 'body1.fontSize',
  }}
/>
```

Reason:
Values are resolved through the MUI theme pipeline.

---

### Theme Hook for Dynamic Values

Allowed:

```tsx
function StatusBadge({ severity }: StatusBadgeProps) {
  const theme = useTheme();
  const bgColor = severity === 'error'
    ? theme.palette.error.light
    : theme.palette.success.light;

  return <span style={{ backgroundColor: bgColor }} />;
}
```

Reason:
Value selection is theme-driven and severity-aware.

---

## Forbidden Patterns

### Hardcoded Color Values

Forbidden:

```tsx
const StyledHeader = styled('div')({
  backgroundColor: '#1976d2',
  color: '#ffffff',
});
```

Reason:
Color is not theme-derived — breaks dark mode and theming.

---

### Hardcoded Spacing Values

Forbidden:

```tsx
<Box sx={{ padding: '16px', marginTop: '8px' }} />
```

Reason:
Spacing bypasses theme grid — layout does not respond to theme.spacing changes.

---

### Hardcoded Typography

Forbidden:

```tsx
const errorMessage = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
};
```

Reason:
Typography is detached from theme — breaks font replacement and responsive scaling.

---

### Inline Raw CSS Values in SX

Forbidden:

```tsx
<Box sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)' }} />
```

Reason:
Raw color bypasses theme palette — does not respond to mode switching.

---

### Importing Raw CSS Files With Hardcoded Values

Forbidden:

```css
/* ComponentStyles.css */
.my-component {
  background-color: #1976d2;
  padding: 16px;
  font-size: 14px;
}
```

Reason:
External CSS cannot be theme-aware — introduces uncontrolled visual layer.

---

### Component-Local Style Constants

Forbidden:

```tsx
const COLORS = {
  primary: '#1976d2',
  error: '#d32f2f',
  background: '#f5f5f5',
};

const SPACING = {
  sm: '8px',
  md: '16px',
  lg: '24px',
};
```

Reason:
Component duplicates what theme tokens already define — creates drift point.

---

### Style Override Without Theme Reference

Forbidden:

```tsx
<Button style={{ backgroundColor: 'green' }} />
```

Reason:
Inline style bypasses theme entirely — unmatchable in dark mode.

---

## Detection Heuristics

Flag the following patterns inside component files:

### Hex/RGB/HSL Color Values

Detect:

```tsx
'#'
'rgb('
'hsl('
'rgba('
'hsla('
```

used in style contexts (sx, styled, inline styles).

---

### Numeric Pixel Values

Detect:

```tsx
'px'
```

in sx, styled, or inline style objects (except where MUI theme spacing accepts numbers).

---

### Inline Font Definitions

Detect:

```tsx
fontFamily
fontSize
fontWeight
```

specified as raw values (not theme references).

---

### Raw CSS Imports

Detect:

```tsx
import './Component.css'
import './ComponentStyles.scss'
```

where the CSS file contains hardcoded design values.

---

### Standalone Color Constants

Detect:

```tsx
const COLORS
const THEME
const palette
const SPACING_MAP
```

defined in component or local utility scope.

---

### Direct Emotion CSS Prop With Raw Values

Detect:

```tsx
css={{
  backgroundColor: '#...'
}}
```

---

## Severity Levels

### P0 — Critical

Component uses hardcoded visual values that break theming.

Examples:

- hardcoded hex/rgb colors
- hardcoded pixel spacing
- hardcoded font definitions

Must fix before release.

---

### P1 — High

Component duplicates token values as local constants.

Examples:

- local COLORS/SPACING objects
- imported raw CSS with design values
- inline style with theme-bypassing values

Must migrate.

---

### P2 — Transitional

Legacy styling patterns with migration plan.

Examples:

- emotion CSS prop with some raw values
- hybrid theme + hardcoded patterns

Allowed temporarily only.

---

### P3 — Informational

Component fully driven by theme tokens.

No action required.

---

## Refactoring Guidance

### Replace Hardcoded Color With Theme Token

BAD:

```tsx
backgroundColor: '#1976d2'
```

GOOD:

```tsx
backgroundColor: 'primary.main'
```

---

### Replace Pixel Spacing With Theme Spacing

BAD:

```tsx
padding: '16px'
```

GOOD:

```tsx
padding: 2 // theme.spacing(2)
```

---

### Replace Local Constants With Token Imports

BAD:

```tsx
const SPACING = { sm: 1, md: 2, lg: 3 };
<Box sx={{ p: SPACING.md }} />
```

GOOD:

```tsx
<Box sx={{ p: 2 }} />
```

---

### Remove Raw CSS Files

BAD:

```css
.my-class { color: #1976d2; }
```

GOOD:

```tsx
const MyStyled = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
}));
```

---

### Replace Inline Styles With Theme

BAD:

```tsx
<Icon style={{ color: 'red' }} />
```

GOOD:

```tsx
<Icon sx={{ color: 'error.main' }} />
```

---

## Library Impact

Violating Theme Sovereignty causes:

- inconsistent visual output across consumers
- broken dark/light mode in hardcoded-value components
- theme changes require per-component updates
- consumer customization is blocked
- design system evolution stalls
- brand adaptation becomes impossible without source edits
- visual drift between components over time
- duplicate style definitions across codebase

Without Theme Sovereignty:
Prati becomes a collection of visually coupled components
instead of a themeable, brand-adaptable design system.

---

## Migration Notes

### Transitional Hardcoded Styles Must Include

```tsx
/**
 * @deprecated-hardcoded-style
 * Token: <which token should replace>
 * Reason: <why hardcoded>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify hardcoded colors, spacing, and typography
2. Replace with equivalent theme tokens
3. Remove local style constants
4. Convert raw CSS imports to styled components
5. Verify appearance matches before/after
6. Verify dark mode renders correctly

---

## Validation Requirements

A component is compliant only if:

- no hardcoded hex/rgb colors exist
- all spacing uses theme.spacing or token constants
- all typography uses theme values
- all colors reference theme palette tokens
- no raw CSS files define design values
- no local style constants duplicate tokens
- component renders correctly in both light and dark mode
- theme changes propagate to component automatically

---

## Compliance Goal

Prati components must behave as:

- theme-driven visual primitives
- token-governed style units
- mode-responsive render elements
- brand-adaptable UI substrates

NOT:

- hardcoded visual elements
- theme-bypassing style islands
- mode-blind color containers
- inflexible design fragments
```

# Architecture: Theming

Prati provides a **MUI-based theming system** with light/dark mode support and custom design tokens.

## Theme Structure

```
Theme System
├── ThemeProvider      # MUI theme wrapper
├── Light Theme        # Light mode tokens
├── Dark Theme         # Dark mode tokens
└── ThemeTokens        # Custom design tokens
```

## ThemeProvider Setup

Wrap your application with `ThemeProvider` at app root:

```typescript
import { ThemeProvider, useTheme, ThemeToggle } from 'prati';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: { mode: 'light' },
});

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

function App() {
  return (
    <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const themeContext = useTheme();
  return (
    <>
      <ThemeToggle themeContext={themeContext} />
      <MainContent />
    </>
  );
}
```

## Design Tokens

Prati provides design tokens from `src/theme/tokens/`:

| Token | Usage | Source |
|-------|-------|--------|
| `primary` | Main brand color | `src/theme/tokens/colors.ts` |
| `background.light` | Light mode background | `src/theme/tokens/colors.ts` |
| `background.dark` | Dark mode background | `src/theme/tokens/colors.ts` |
| `error` | Error states | `src/theme/tokens/colors.ts` |
| `success` | Success states | `src/theme/tokens/colors.ts` |

Never hardcode colors — always import from `prati`:

```typescript
import { spacing, typography } from 'prati';
```

### Using Theme in Components

```typescript
import { useTheme } from 'prati';

function MyComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
      }}
    >
      Content
    </Box>
  );
}
```

## Theme Toggle

Use `ThemeToggle` component for light/dark switching:

```typescript
import { useTheme, ThemeToggle } from 'prati';

function AppHeader() {
  const themeContext = useTheme();

  return (
    <AppBar>
      <Toolbar>
        <Typography>Application</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeToggle themeContext={themeContext} />
      </Toolbar>
    </AppBar>
  );
}
```

## Custom Theme Extensions

Extend Prati's theme with application-specific tokens by deriving from your design system:

> **Architectural Boundary Note:** `createTheme` palette configuration is the one consumer-controlled boundary where custom brand color values are acceptable. This is the entry point where consumers inject their brand identity into the MUI theme pipeline. Once set here, those colors propagate through the theme and must be referenced as tokens in all component code. Component code must **never** hardcode raw color values — always reference `theme.palette.*` or `sx` token paths.

```typescript
import { createTheme } from '@mui/material/styles';
import { spacing, typography } from 'prati';

// Brand colors are defined ONCE at the theme entry point — not in components.
// After this point, all components reference theme.palette.primary.main,
// theme.palette.background.default, etc. — never raw hex values.
const appLightTheme = createTheme({
  ...baseTheme,
  palette: {
    primary: { main: brandColors.primary },   // from your brand config, not inline hex
    background: {
      default: brandColors.backgroundLight,
      paper: brandColors.surface,
    },
  },
  spacing: spacing.unit,
  typography: {
    fontFamily: typography.fontFamily,
  },
});
```

If no brand config exists yet, define a central `src/theme/brand.ts` that owns all raw values — never scatter hex strings across multiple files.
```

## Using Tokens in Components

### DO: Use Theme Tokens
```typescript
<Box sx={{ backgroundColor: 'primary.main' }}>
  Content
</Box>
```

### DON'T: Hardcode Colors
```typescript
<Box sx={{ backgroundColor: '#1976d2' }}>
  Content
</Box>
```

## Rules

- **Never hardcode colors** — always use theme tokens
- **Use ThemeProvider** at app root
- **Use useTheme hook** for theme access
- **Include ThemeToggle** in headers/toolbars
- **Support both** light and dark modes

## Related

- [MVVM Separation Invariant](../invariants/mvvm-separation.md)
- [State Management](../integration-contracts/state-management.md)
- [Localization](localization.md)

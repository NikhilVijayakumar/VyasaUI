# Integration Contract: Getting Started

Guides a consumer through the initial Prati setup — provider hierarchy, import paths, and minimal working application.

## Provider Hierarchy

Prati requires two providers at the application root. The nesting order is fixed:

```
<ThemeProvider>          ← outermost — creates ThemeContext
  <LanguageProvider>     ← inside ThemeProvider — may use theme tokens for locale UI
    <App />
  </LanguageProvider>
</ThemeProvider>
```

See [Provider Hierarchy](../runtime-maps/provider-hierarchy.md) for data flow details. See [Theme Sovereignty Invariant](../invariants/theme-sovereignty.md) and [Localization Invariant](../invariants/localization.md) for the authoritative rules.

## Installation

```bash
npm install prati @mui/material @emotion/react @emotion/styled
```

Prati declares `react`, `react-dom`, `@mui/material`, `@emotion/react`, and `@emotion/styled` as peer dependencies — consumers must install them independently.

## Minimal Setup

```typescript
import { ThemeProvider, LanguageProvider } from 'prati';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const translations = {
  en: { 'app.title': 'My Application' },
  es: { 'app.title': 'Mi Aplicación' },
};

function App() {
  return (
    <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
      <LanguageProvider
        translations={translations}
        availableLanguages={[
          { code: 'en', label: 'English' },
          { code: 'es', label: 'Español' },
        ]}
        defaultLanguage="en"
      >
        <MainContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

## Import Paths

All public exports are available from the package root:

```typescript
import { ThemeProvider, LanguageProvider, useTheme, useLanguage } from 'prati';
import { spacing, typography } from 'prati';
import { Button, Card, DataTable } from 'prati';
```

## Adding Consumer Providers

Consumer-specific providers (Auth, Router) must be nested inside both Prati providers:

```typescript
<ThemeProvider ...>
  <LanguageProvider ...>
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  </LanguageProvider>
</ThemeProvider>
```

## Next Steps

- [Feature Structure](feature-structure.md) — consumer directory layout and MVVM layers
- [State Management](state-management.md) — `useDataState` and `AppStateHandler` contracts
- [Component Tiers](../core/component-tiers.md) — atomic design guidance
- [Theming](../core/theming.md) — theme customization
- [Localization](../core/localization.md) — i18n setup

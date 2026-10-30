# Runtime Map: Provider Hierarchy

Maps provider nesting order and data flow at runtime.

```
App Root
  └── <ErrorBoundary>
        └── <ThemeProvider>            ← creates ThemeContext
              └── <LanguageProvider>   ← reads ThemeContext for theme-aware locale UI
                    └── <AuthProvider> ← consumer-managed
                          └── <Router>
                                └── <Page>
                                      ├── useTheme()
                                      ├── useLanguage() → literal['key']
                                      └── useDataState()
```

## Data Flow

| Provider | Context Shape | Consumer Hook |
|----------|--------------|---------------|
| ThemeProvider | `{ darkMode, toggleDarkMode }` | `useTheme()` |
| LanguageProvider | `{ literal, currentLanguage, setCurrentLanguage }` | `useLanguage()` |
| AuthProvider | consumer-defined | consumer-defined |

## Rules

- ThemeProvider must be outermost (affects MUI's default theme for all children)
- LanguageProvider must be inside ThemeProvider (localization UI may use theme tokens)
- Consumer providers (Auth, Router) go inside both

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/theme-sovereignty.md` | T-2: Theme at root |
| `invariants/localization.md` | L-3: Provider placement |
| `core/theming.md` | Theme setup |
| `core/localization.md` | Language setup |
| `integration-contracts/getting-started.md` | Combined provider example |

# Architecture: Localization (i18n)

Prati provides a **React Context-based localization system** with runtime language switching and dictionary-based translations.

## Localization Structure

```
Localization System
├── LanguageProvider    # i18n context wrapper
├── useLanguage Hook    # Access translations
├── Translation Files  # Per-language files
└── Available Languages # Language config
```

## LanguageProvider Setup

Wrap your application with `LanguageProvider` at app root:

```typescript
import { LanguageProvider, useLanguage } from 'prati';

const translations = {
  en: {
    'app.title': 'My Application',
    'app.welcome': 'Welcome',
  },
  es: {
    'app.title': 'Mi Aplicación',
    'app.welcome': 'Bienvenido',
  },
};

const availableLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

function App() {
  return (
    <LanguageProvider
      translations={translations}
      availableLanguages={availableLanguages}
      defaultLanguage="en"
    >
      <MainContent />
    </LanguageProvider>
  );
}
```

## useLanguage Hook

Use `useLanguage` hook to access translations:

```typescript
import { useLanguage } from 'prati';

function PageHeader() {
  const { currentLanguage, setCurrentLanguage, literal, availableLanguages } = useLanguage();

  return (
    <div>
      <h1>{literal['app.title']}</h1>
      <button onClick={() => setCurrentLanguage('es')}>
        {availableLanguages.find(l => l.code === currentLanguage)?.label}
      </button>
    </div>
  );
}
```

## Translation Key Patterns

### Naming Convention

```
{domain}.{page}.{element}

app.list.title        → 'Item List'
app.install.button    → 'Install'
app.settings.save     → 'Save Settings'
error.notFound        → 'Not Found'
```

### Translation Files Structure

```
src/
└── common/
    └── localization/
        ├── en.json     # English translations
        ├── es.json     # Spanish translations
        └── index.ts    # Translation exports
```

### Translation JSON Format

Translation files use **flat dot-notation keys** — matching the `literal['key']` access pattern exactly.

```json
{
  "app.title": "My Application",
  "app.welcome": "Welcome",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.loading": "Loading...",
  "common.error": "Error"
}
```

> **Key format rule:** Keys are always flat strings in dot-notation (`domain.page.element`). Do NOT use nested JSON objects — `literal['app.title']` resolves a flat key; nested objects are not traversed.

## Using Translations in Components

### DO: Use Translation Keys
```typescript
function AppHeader() {
  const { literal } = useLanguage();

  return (
    <Box>
      <Typography variant="h4">{literal['app.title']}</Typography>
      <Button>{literal['common.save']}</Button>
    </Box>
  );
}
```

### DON'T: Hardcode Strings
```typescript
function AppHeader() {
  return (
    <Box>
      <Typography variant="h4">My Application</Typography>
      <Button>Save</Button>
    </Box>
  );
}
```

## Language Switching

### Per-Component Language
```typescript
function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage, availableLanguages } = useLanguage();

  return (
    <Select value={currentLanguage} onChange={(e) => setCurrentLanguage(e.target.value)}>
      {availableLanguages.map(lang => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.label}
        </MenuItem>
      ))}
    </Select>
  );
}
```

## Interpolation Pattern

When translation strings contain dynamic values (counts, names, dates), use the `{{placeholder}}` syntax in translation files. Prati's `literal[key]` returns the raw string — interpolation is resolved by a consumer-managed template function.

### Translation File

```json
{
  "common.itemsSelected": "{{count}} items selected",
  "common.welcome": "Welcome, {{name}}",
  "error.loadFailed": "Failed to load {{resource}}"
}
```

### Consumer Template Helper

Define a single interpolation utility in your app (not inside components):

```typescript
// src/common/i18n/interpolate.ts
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(values[key] ?? ''));
}
```

### Usage in ViewModel Hook

Resolve interpolated strings in the ViewModel hook, not in components:

```typescript
import { useLanguage } from 'prati';
import { interpolate } from '../../common/i18n/interpolate';

export const useItemsViewModel = () => {
  const { literal } = useLanguage();

  const getSelectionLabel = (count: number) =>
    interpolate(literal['common.itemsSelected'], { count });

  return { getSelectionLabel };
};
```

### Component Usage

```typescript
function ItemList({ selectedCount }: { selectedCount: number }) {
  const { getSelectionLabel } = useItemsViewModel();
  return <span>{getSelectionLabel(selectedCount)}</span>;
}
```

### Rules

- Placeholder syntax is `{{name}}` — double curly braces, camelCase key
- Interpolation is always resolved in the ViewModel hook layer, not in components
- `literal[key]` must never be concatenated directly — use the interpolation helper
- The helper lives in `common/i18n/` and is consumer-owned, not a Prati internal

---

## Rules

- **Never hardcode strings** — always use translation keys
- **Use LanguageProvider** at app root
- **Use useLanguage hook** for translations
- **Follow key pattern**: `{domain}.{page}.{element}`
- **Support languages**: English (en), expandable

## Related

- [MVVM Separation Invariant](../invariants/mvvm-separation.md)
- [State Management](../integration-contracts/state-management.md)
- [Theming](theming.md)

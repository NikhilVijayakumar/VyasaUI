# Localization Invariant

## Purpose

Prati is a locale-aware UI component library.

All user-facing text must be driven by the localization system. Components must not contain hardcoded strings, language-specific phrasing, or embedded locale assumptions.

Text content must flow through the `LanguageProvider` context via the `useLanguage` hook using translation keys.

Localization guarantees:
- single-source translation management
- instant language switching without re-render architecture changes
- locale-independent component behavior
- consumer-controlled translation files
- RTL/LTR readiness (layout must not assume text direction)

---

## Architectural Rule

Components must reference translation keys exclusively for all user-facing text.

A component may:
- use the `useLanguage` hook to access translated strings
- reference translation keys as `literal['domain.element.key']`
- pass translated strings as props from parent (already-translated)
- render dynamic content that is not user-facing text (data values, numbers)

A component may NOT:
- hardcode user-facing string literals
- embed locale-specific formatting assumptions
- assume text direction (LTR/RTL) in layout
- contain language-specific pluralization logic
- define inline fallback strings without keys
- concatenate translated strings for grammatical correctness

---

## Allowed Patterns

### Translation Key Access

Allowed:

```tsx
function PageHeader() {
  const { literal } = useLanguage();

  return (
    <Typography variant="h4">
      {literal['page.header.title']}
    </Typography>
  );
}

Reason:
Text is resolved through the localization context.

---

### Props-Driven Translated Text

Allowed:

```tsx
interface AlertBannerProps {
  message: string;
  severity: 'error' | 'warning' | 'info';
}

function AlertBanner({ message, severity }: AlertBannerProps) {
  return <Alert severity={severity}>{message}</Alert>;
}
```

Reason:
Text is provided by the consumer who manages translation.

---

### Dynamic Non-Text Content

Allowed:

```tsx
function DataCount({ count }: { count: number }) {
  return <span>{count} records</span>; // "records" must be from literal
}
```

Wait — "records" is user-facing text. Correct pattern:

```tsx
function DataCount({ count }: { count: number }) {
  const { literal } = useLanguage();
  return <span>{literal['data.recordCount']}</span>;
}
```

Reason:
All user-facing strings must be localizable, including those mixed with data.

---

### Translation Key as Prop Interface

Allowed:

```tsx
interface ConfirmDialogProps {
  titleKey: string;
  messageKey: string;
  confirmKey: string;
  cancelKey: string;
}

function ConfirmDialog({ titleKey, messageKey, confirmKey, cancelKey }: ConfirmDialogProps) {
  const { literal } = useLanguage();
  return (
    <Dialog>
      <DialogTitle>{literal[titleKey]}</DialogTitle>
      <DialogContent>{literal[messageKey]}</DialogContent>
      <Button>{literal[confirmKey]}</Button>
      <Button>{literal[cancelKey]}</Button>
    </Dialog>
  );
}
```

Reason:
Component remains locale-neutral; consumer provides keys.

---

## Forbidden Patterns

### Hardcoded User-Facing Strings

Forbidden:

```tsx
function EmptyState() {
  return <div>No items found</div>;
}
```

Reason:
String is not localizable — blocks translation.

---

### Concatenated Translated Strings

Forbidden:

```tsx
const { literal } = useLanguage();
const message = literal['greeting.hello'] + ' ' + userName + ' ' + literal['greeting.welcome'];
```

Reason:
Sentence structure varies by locale — concatenation breaks grammar in other languages.

---

### Embedded Pluralization Logic

Forbidden:

```tsx
function ItemCount({ count }: { count: number }) {
  return <span>{count} {count === 1 ? 'item' : 'items'}</span>;
}
```

Reason:
Pluralization rules differ across languages (some have dual, trial, or no plural forms).

---

### Language-Specific Formatting

Forbidden:

```tsx
function DateDisplay({ date }: { date: Date }) {
  return <span>{date.toLocaleDateString('en-US')}</span>;
}
```

Reason:
Locale is hardcoded — should use the active language from context.

---

### Inline Fallback Strings

Forbidden:

```tsx
<span>{literal['key.name'] || 'Default Name'}</span>
```

Reason:
Fallback string is not localizable — missing key should error visibly, not silently fall back.

---

### Assumed Text Direction in Layout

Forbidden:

```tsx
<Box sx={{ paddingLeft: 2 }} />
```

where the component should support RTL layouts. Use logical properties instead.

---

### Nested/Scoped Translation Keys Inside Components

Forbidden:

```tsx
const messages = {
  title: 'My Component',
  subtitle: 'My Subtitle',
};
```

Reason:
Component-local translation maps bypass the centralized localization system.

---

## Detection Heuristics

Flag the following patterns inside component files:

### Hardcoded String Literals in JSX

Detect:

```tsx
<div>some text</div>
<Typography>some text</Typography>
<Button>some text</Button>
```

where the text content is a string literal (not a variable, prop, or literal access).

---

### String Concatenation for Display

Detect:

```tsx
{var1 + ' ' + var2}
{`Hello ${name}`}
```

where the string template contains user-facing phrasing.

---

### Numeric/Metric String Literals

Detect:

```tsx
'items'
'records'
'users'
'error'
'loading'
'success'
```

used as standalone string content in JSX.

---

### Locale-Specific Formatting Calls

Detect:

```tsx
toLocaleDateString
toLocaleString
toLocaleTimeString
```

without using the active language context.

---

### Pluralization Logic

Detect:

```tsx
=== 1 ? '...' : '...'
```

used to switch between singular/plural text forms.

---

### PropTypes/String Defaults With Text

Detect:

```tsx
defaultProps: {
  label: 'Submit'
}
```

where the default is a user-facing string.

---

## Severity Levels

### P0 — Critical

Component contains hardcoded user-facing string literals.

Examples:

- raw text in JSX
- hardcoded button labels
- hardcoded placeholder text
- hardcoded error messages

Must fix before release.

---

### P1 — High

Component contains locale-specific formatting or pluralization.

Examples:

- toLocaleDateString with hardcoded locale
- singular/plural branching
- string concatenation for display

Must migrate.

---

### P2 — Transitional

Component accepts strings as props but does not provide key-based interface.

Examples:

- string props without key alternative
- legacy components with mixed text sources

Allowed temporarily with migration plan.

---

### P3 — Informational

Component fully localization-driven.

No action required.

---

## Refactoring Guidance

### Replace Hardcoded Strings With Translation Keys

BAD:

```tsx
<Button>Save Changes</Button>
```

GOOD:

```tsx
<Button>{literal['common.save']}</Button>
```

---

### Use Template-Based Translation for Dynamic Content

BAD:

```tsx
<span>{count} items selected</span>
```

GOOD:

```tsx
<span>{literal['common.itemsSelected']}</span>
```

Translation file:

```json
{
  "common.itemsSelected": "{{count}} items selected"
}
```

Note: The current `literal[key]` API returns the raw string. Use the consumer's preferred interpolation method for dynamic values.

---

### Remove Local Message Objects

BAD:

```tsx
const LABELS = { save: 'Save', cancel: 'Cancel' };
<Button>{LABELS.save}</Button>
```

GOOD:

```tsx
<Button>{literal['common.save']}</Button>
<Button>{literal['common.cancel']}</Button>
```

---

### Use Active Language for Formatting

BAD:

```tsx
date.toLocaleDateString('en-US')
```

GOOD:

```tsx
const { currentLanguage } = useLanguage();
date.toLocaleDateString(currentLanguage)
```

---

### Replace Pluralization Branching

BAD:

```tsx
{count === 1 ? '1 item' : `${count} items`}
```

GOOD:

```tsx
{literal['common.itemCount']}
```

---

## Library Impact

Violating Localization causes:

- application cannot be translated without source changes
- inconsistent language switching behavior
- locale-specific bugs in non-English usage
- duplicated translation effort across teams
- broken RTL layout support
- inaccessible international markets
- consumer lock-in to English-only interface
- runtime language switching becomes unreliable

Without Localization:
Prati becomes a single-locale component set
instead of a globally usable UI library.

---

## Migration Notes

### Transitional Hardcoded Strings Must Include

```tsx
/**
 * @deprecated-hardcoded-string
 * Key: <target translation key>
 * Reason: <why hardcoded>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify all hardcoded user-facing strings in components
2. Define translation keys in the component's documentation
3. Replace string literals with `literal['key']` access
4. Remove local message maps
5. Update component props to accept keys where appropriate
6. Verify language switching works for all occurrences

---

## Validation Requirements

A component is compliant only if:

- no hardcoded user-facing strings exist
- all text content flows through `useLanguage` literal object
- no locale-specific formatting is hardcoded
- no pluralization logic exists in component
- no string concatenation for display exists
- component renders identically regardless of active language
- consumer can provide all text content through keys or props

---

## Compliance Goal

Prati components must behave as:

- locale-agnostic presentation units
- translation-key-driven text containers
- direction-neutral layout elements
- globally adaptable UI primitives

NOT:

- English-only text holders
- locale-coupled UI elements
- hardcoded language fragments
- translation-blocked UI blocks

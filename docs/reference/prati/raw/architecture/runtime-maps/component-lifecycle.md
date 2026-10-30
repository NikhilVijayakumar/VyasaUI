# Runtime Map: Component Lifecycle

Maps the lifecycle of a Prati component from import to render.

## Import Resolution

```
Consumer Code
     │
     ├── import { Card } from "prati"
     │         │
     │         ▼
     │   src/lib.ts              ← entry point
     │         │
     │         ▼
     │   src/common/components/index.ts  ← barrel
     │         │
     │         ▼
     │   src/common/components/molecules/Card.tsx  ← actual component
     │
     ├── import { spacing } from "prati"
     │         │
     │         ▼
     │   src/theme/index.ts     ← re-exports tokens
     │         │
     │         ▼
     │   src/theme/tokens/spacing.ts  ← token values
```

## Render Pipeline

```
Component Definition
     │
     ├── Props validation (TypeScript compile-time)
     │
     ├── Theme resolution
     │     │
     │     ├── useTheme() → ThemeContext
     │     └── MUI's ThemeProvider wraps all children
     │
     ├── Localization resolution
     │     │
     │     └── useLanguage() → literal['key']
     │
     ├── State management (Organisms only — via ViewModel hook)
     │     │
     │     └── use<Feature>ViewModel()         ← ViewModel hook in hooks/
     │               │
     │               └── useDataState<T>()     ← called inside ViewModel, not component
     │                         │
     │                         ▼
     │                   DataState<T>  ──────▶  AppStateHandler
     │                                              ├── loading  → LoadingState
     │                                              ├── error    → ErrorState
     │                                              └── data     → SuccessComponent
     │
     └── Render
           │
           ├── Atoms / Molecules → pure props-driven render
           └── Organisms → AppStateHandler routes to correct state UI
```

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/stateless-ui.md` | S-1: Components receive data via props |
| `invariants/theme-sovereignty.md` | T-1: All styling via theme |
| `invariants/localization.md` | L-1: All text via translation keys |
| `invariants/atomic-hierarchy.md` | A-1 through A-4: Tier classification |
| `invariants/mvvm-separation.md` | M-1: ViewModel mediates between Model and View |
| `core/component-tiers.md` | Tier guidance |
| `integration-contracts/state-management.md` | useDataState and AppStateHandler contracts |

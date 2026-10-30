# Integration Contract: Feature Structure

Defines the consumer directory layout for building MVVM-compliant features with Prati components.

## Directory Layout

Each feature follows a consistent structure that mirrors the MVVM layer separation:

```
src/
├── app/
│   ├── App.tsx                    ← Provider assembly (ThemeProvider + LanguageProvider)
│   └── main.tsx                   ← Entry point
│
├── common/
│   ├── components/
│   │   ├── atoms/                 ← Tier 0: Primitives
│   │   │   └── StatusDot.tsx
│   │   ├── molecules/             ← Tier 1: Composed functional units
│   │   │   └── UserInfoCard.tsx
│   │   ├── organisms/             ← Tier 2: Complex UI sections (may use ViewModels)
│   │   │   └── UserList.tsx
│   │   └── templates/             ← Tier 3: Page layouts
│   │       └── DashboardTemplate.tsx
│   │
│   ├── hooks/                     ← ViewModel layer
│   │   └── useUserViewModel.ts
│   │
│   ├── repos/                     ← Model layer — data access
│   │   └── UserRepo.ts
│   │
│   ├── domain/                    ← Model layer — business logic
│   │   └── pricing.ts
│   │
│   └── localization/              ← Translation files
│       ├── en.json
│       ├── es.json
│       └── index.ts
│
└── theme/                         ← Theme configuration
    ├── brand.ts                   ← Entry point for consumer brand colors
    └── index.ts                   ← Theme assembly
```

## Layer Rules

### View Layer (`components/`)

- All Prati components belong here — atoms, molecules, organisms, templates
- Views must NOT import from `repos/`, `domain/`, or make API calls
- Organisms may import ViewModel hooks from `hooks/`
- Templates must NOT use `useDataState` — data arrives via props or is managed in Page Containers

See [MVVM Separation Invariant](../invariants/mvvm-separation.md) and [Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md) for authoritative rules.

### ViewModel Layer (`hooks/`)

- Each ViewModel is a custom hook: `use<Feature>ViewModel.ts`
- ViewModels may import from `repos/` and `domain/`
- ViewModels must NOT import from `components/` or return JSX
- ViewModels must NOT manage UI interaction state (animation, open/closed)

```typescript
// hooks/useUserViewModel.ts
import { useDataState } from 'prati';
import { UserRepo } from '../repos/UserRepo';

export function useUserViewModel() {
  const [state, execute] = useDataState<User[]>();
  const loadUsers = () => execute(() => UserRepo.getAll());
  return { state, loadUsers };
}
```

### Model Layer (`repos/`, `domain/`)

- Repository files own all data access (API calls, persistence, caching)
- Domain files own business logic, computations, and validation
- Model layer must NOT import from `components/` or `hooks/`
- Model layer must NOT reference theme or localization

See [Repository Isolation Invariant](../invariants/repository-isolation.md) for authoritative rules.

## Import Direction

```
components/  ──imports──▶  hooks/  ──imports──▶  repos/ + domain/
```

Views import ViewModels. ViewModels import Models. Models never import Views or ViewModels.

## Page Containers

A Page Container is a consumer-level component that composes templates and orchestrates page-level ViewModels. It lives in `src/pages/` (outside `common/components/`):

```
src/pages/
├── DashboardPage.tsx    ← composes DashboardTemplate + useDashboardViewModel
└── SettingsPage.tsx     ← composes SettingsTemplate + useSettingsViewModel
```

Page Containers may use `useDataState` (unlike Templates) but must still route data access through ViewModel hooks — never directly import repositories.

## Related

- [Getting Started](getting-started.md) — provider setup
- [State Management](state-management.md) — useDataState and AppStateHandler
- [Component Tiers](../core/component-tiers.md) — atomic design guidance

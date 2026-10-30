# Architecture: Component Tiers

Prati is organized by Atomic Design methodology. See [Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md) for the authoritative rules.

## Tier Overview

Every component belongs to exactly one tier. The hierarchy enforces predictable complexity scaling and clear dependency direction:

| Tier | Scope | Imports From | Example |
|------|-------|-------------|---------|
| **Atom** | Single element, primitive | Theme tokens, localization | `StatusDot`, `SeverityBadge`, `ErrorState` |
| **Molecule** | Composed functional unit | Atoms, theme, localization | `Card`, `Notification`, `TrendMetricCard` |
| **Organism** | Complex UI section | Molecules, atoms, theme | `DataTable`, `FormLayout`, `AudioPlayerBar` |
| **Template** | Page layout structure | Organisms, molecules, atoms | `PageHeader`, `SummaryPanel`, `HeroSection` |

## Tier Rules

### Atom

An Atom renders a single HTML element or primitive. It accepts simple props (string, number, boolean, callback) and may use theme tokens and localization.

```typescript
// Atom example: StatusDot
interface StatusDotProps {
  status: 'online' | 'offline' | 'error';
  size?: 'sm' | 'md' | 'lg';
}
```

Atoms may NOT: compose other components, manage data, contain business logic.

### Molecule

A Molecule composes atoms into a functional unit. It may have layout logic but no data access.

```typescript
// Molecule example: Card
interface CardProps {
  title: string;
  children: React.ReactNode;
  onAction?: () => void;
}
```

Molecules may NOT: import from organism or template tiers, access repositories, manage data state.

### Organism

An Organism composes molecules and atoms into a complex section. It may use ViewModel hooks (`useDataState`) for state orchestration — this is the primary mechanism by which organisms manage async data without violating stateless principles. See [Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md) for the authoritative rules.

```typescript
// Organism example: DataTable
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}
```

Organisms may NOT: import from template tiers, access repositories directly (must use ViewModel hooks), define page-level layout.

### Template

A Template composes organisms, molecules, and atoms into a page-level layout. Templates define structure, not behavior.

```typescript
// Template example: PageHeader
interface PageHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}
```

Templates may NOT: contain data dependencies, manage state, include business logic.

## Classification Guidelines

### Placement

```
src/common/components/
  atoms/        # Tier 0: primitives
  molecules/    # Tier 1: composed units
  organisms/    # Tier 2: complex sections
  templates/    # Tier 3: page layouts
```

### Promotion Criteria

A component should be promoted to a higher tier when it:
- composes multiple sub-components (Atom → Molecule)
- orchestrates state across sub-units (Molecule → Organism)
- defines a reusable page structure (Organism → Template)

### Demotion Criteria

A component should be demoted when it:
- has no sub-component composition (→ Atom)
- has simple layout without orchestration (→ Molecule)
- is used only as a building block (→ lower tier)

## Tier Boundary Violations

| Violation | Example | Fix |
|-----------|---------|-----|
| Atom imports Molecule | `Atom.tsx` imports `Card` | Move logic to caller |
| Molecule uses data state | `Card.tsx` calls `useDataState` | Pass data via props |
| Organism imports Template | `DataTable.tsx` imports `PageHeader` | Restructure composition |
| Organism accesses repository directly | `DataTable.tsx` imports `ApiService` directly | Use a ViewModel hook |
| Template accesses repo | `PageHeader.tsx` imports `ApiService` | Move to Page container |

## Related

- [Feature Structure](../integration-contracts/feature-structure.md)
- [Stateless UI Invariant](../invariants/stateless-ui.md)
- [MVVM Separation Invariant](../invariants/mvvm-separation.md)

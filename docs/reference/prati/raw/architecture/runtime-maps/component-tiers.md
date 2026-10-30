# Runtime Map: Component Tiers

Maps the Atomic Design tier hierarchy, import directions, and hook/repository access rules at runtime.

## Tier Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TEMPLATE (Tier 3)                               │
│  Page-level layout structure. Composes organisms, molecules, atoms.    │
│  No data dependencies. No state. No repository access.                 │
└───────────────────┬────────────────────────────────────────────────────┘
                    │ composes ▼
┌───────────────────▼────────────────────────────────────────────────────┐
│                       ORGANISM (Tier 2)                                │
│  Complex UI section. May use ViewModel hooks (useDataState) for state  │
│  orchestration. Composes molecules and atoms.                          │
└───────────────────┬────────────────────────────────────────────────────┘
                    │ composes ▼
┌───────────────────▼────────────────────────────────────────────────────┐
│                       MOLECULE (Tier 1)                                │
│  Composed functional unit. Combines atoms. Props-only — no data state, │
│  no repositories, no hooks beyond theme and localization.              │
└───────────────────┬────────────────────────────────────────────────────┘
                    │ composes ▼
┌───────────────────▼────────────────────────────────────────────────────┐
│                         ATOM (Tier 0)                                  │
│  Single primitive element. Props-only. Renders one HTML element or     │
│  primitive. No composition of other components.                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Import Direction Rules

Valid import directions flow **downward only** (higher tier imports lower tier):

```
Template  ──imports──▶  Organism
Template  ──imports──▶  Molecule
Template  ──imports──▶  Atom

Organism  ──imports──▶  Molecule
Organism  ──imports──▶  Atom

Molecule  ──imports──▶  Atom

Atom      ──imports──▶  (theme tokens, localization — never other components)
```

**Forbidden import directions (upward):**

```
Atom      ✗──imports──▶  Molecule / Organism / Template
Molecule  ✗──imports──▶  Organism / Template
Organism  ✗──imports──▶  Template
```

## Hook and API Access by Tier

| Tier | `useTheme()` | `useLanguage()` | `useDataState()` | Repository (`ApiService`) |
|------|:---:|:---:|:---:|:---:|
| **Atom** | ✅ | ✅ | ❌ | ❌ |
| **Molecule** | ✅ | ✅ | ❌ | ❌ |
| **Organism** | ✅ | ✅ | ✅ via ViewModel hook | ❌ direct — use ViewModel |
| **Template** | ✅ | ✅ | ❌ | ❌ |
| **Page Container** (consumer) | ✅ | ✅ | ✅ | ❌ direct — use ViewModel |

> **Note:** Organisms and Page Containers may call `useDataState` only through ViewModel hooks in `hooks/use<Feature>.ts`. They must never call `useDataState` raw or import from `repo/` directly.

## Tier Placement Directory

```
src/common/components/
  atoms/        # Tier 0 — single-element primitives
  molecules/    # Tier 1 — composed functional units
  organisms/    # Tier 2 — complex UI sections
  templates/    # Tier 3 — page layout structures
```

## Violation Detection

| Symptom | Tier Violation | Fix |
|---------|---------------|-----|
| Atom file imports another component | Atom → Molecule/Organism/Template | Decompose — atoms compose nothing |
| Molecule calls `useDataState` | Molecule uses data state | Pass data via props from parent |
| Molecule imports from `organisms/` | Molecule → Organism (upward) | Restructure — molecule must not import organisms |
| Organism imports `ApiService` directly | Organism → Repository (direct) | Wrap in ViewModel hook in `hooks/` |
| Organism imports from `templates/` | Organism → Template (upward) | Invert — templates compose organisms |
| Template has `useDataState` | Template uses data state | Move to Page container |
| Template imports from `repo/` | Template → Repository | Move to Page container ViewModel |

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/atomic-hierarchy.md` | Authoritative tier definitions and rules |
| `core/component-tiers.md` | Tier guidance and classification criteria |
| `invariants/stateless-ui.md` | S-1: Components receive data via props |
| `invariants/mvvm-separation.md` | M-1 through M-4: Layer separation |
| `integration-contracts/feature-structure.md` | Consumer feature directory layout |

# Mock Data

## Overview

Mock Data provides prototype datasets that simulate realistic application behavior without requiring backend services. Mock data allows prototypes to demonstrate data-driven workflows, populate UI components, and support user interactions with realistic content.

Mock Data is consumed by Persistence (which tracks user modifications) and Boilerplate (which integrates it into the prototype shell).

---

# Purpose

Mock Data exists to support realistic prototype demonstrations.

The goal is to provide meaningful data for prototypes to display, manipulate, and persist.

Examples include:

* Seed Data for Tables
* Sample Records for Forms
* Preview Content for Viewers
* Default Preferences
* Initial Application State

without requiring production databases or APIs.

---

# Responsibilities

Mock Data provides:

* Static Seed Datasets
* Data Structure Definitions
* Default Values
* Sample Records
* Initialization Behavior

Mock Data does not provide:

* Production Data
* External Data Sources
* Live API Integration
* Real User Data
* Sensitive Information

---

# Data Sources

## Static Seed Data

Predefined datasets embedded in the prototype configuration.

Examples:

* User Records
* Task Lists
* Configuration Presets
* Reference Data

## Generated Data

Data produced programmatically during prototype initialization.

Examples:

* Randomized Records
* Timestamp-based Entries
* Sequential Identifiers

## User-Entered Data

Data created through prototype interactions.

This data becomes the responsibility of the Persistence feature.

---

# Data Lifecycle

## Initialization

When a prototype starts:

1. Static seed data is loaded from configuration
2. Generated data is produced (if configured)
3. Persisted data from previous sessions is restored
4. Data sources are merged into the application state

## Mutation

During prototype execution:

1. Users interact with data through the prototype UI
2. Persistence tracks changes made to the dataset
3. Mock Data provides the initial baseline

## Reset

Prototypes may reset to initial state:

1. All user modifications are discarded
2. Seed data is re-loaded from configuration
3. Generated data is re-produced
4. The prototype returns to its initial state

---

# Business Rules

1. **Seed before mutation** — Mock data seed sets must be loaded before any user interaction begins; the initial dataset is always deterministic and reproducible
2. **Reset to known state** — A reset must return the prototype to its exact initial seed state, discarding all user modifications
3. **Schema matching** — Mock data structures must match the expected input schemas of the components that consume them
4. **No production data** — Mock data must never contain real user information, credentials, or production-sensitive content
5. **Data isolation** — Mock data is independent per prototype instance; one prototype's data must never leak into another

# States

## Seeded

Seed data loaded; prototype has initial dataset available.

## Generated

Generated data produced; dataset includes programmatic entries.

## Mutated

User modifications applied on top of initial data.

## Reset

Data cleared and re-initialized from seed and generated sources.

## Empty

No seed or generated data configured; prototype starts with empty state.

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Empty | Seeded | Seed data configuration is loaded |
| Seeded | Generated | Generation process produces additional records |
| Generated | Mutated | User creates, updates, or deletes records |
| Mutated | Seeded | Reset triggered; modifications discarded |
| Seeded | Empty | Seed configuration removed; no data sources |

---

# Edge Cases

- **No seed data configured**: Prototype starts with empty dataset
- **Duplicate seed entries**: Seed data contains duplicate identifiers; may cause key collisions
- **Invalid seed format**: Seed data does not match expected schema; initialization may fail
- **Large seed datasets**: Large datasets may affect prototype load time
- **Missing generated data**: Generation produces no entries; falls back to seed data only

---

# Error Conditions

- **Invalid seed data format** — Seed data does not match expected schema; initialization fails
- **Seed data load failure** — Configuration is malformed or missing; prototype starts empty
- **Generation failure** — Programmatic generation encounters an error; falls back to seed data only
- **Data type mismatch** — Seed values do not match expected types; rendering may produce incorrect output

## Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Invalid seed data format | Validate seed data schema against component expectations; correct field types and structure before re-initializing |
| Seed data load failure | Check configuration file syntax and path; provide default seed set if configuration is missing |
| Generation failure | Verify generation logic and fall back to static seed data; fix generation code and re-run |
| Data type mismatch | Compare seed data types with component prop types; cast or transform values to match |

---

# Authorization

**Visibility:** Internal — mock data is a prototype development resource; all prototype authors may configure mock data without access restrictions.

---

# Relationship to Persistence

Persistence tracks user modifications to mock data.

```text
Mock Data (Seed)
     |
     ↓
Persistence (User Modifications)
     |
     ↓
Updated Prototype State
```

Mock Data provides the baseline; Persistence tracks the delta.

---

# Relationship to Boilerplate

Boilerplate integrates mock data into the prototype shell.

Mock Data configuration is part of the boilerplate setup.

---

# Verification

- **Seed load test**: Initialize a prototype; verify all seed datasets are available to components without errors
- **Reset test**: Modify data through UI, trigger reset; verify the prototype returns to its exact initial seed state
- **Schema validation test**: Feed intentionally mismatched seed data; verify the error is reported and the prototype provides a clear message
- **Data isolation test**: Create two prototype instances; verify modifying data in one does not affect the other
- **Production data audit**: Scan seed data files; verify no real user information, credentials, or sensitive content is present

# Success Criteria

Mock Data is considered successful when:

* Prototypes start with meaningful initial data.
* Seed data is available without backend services.
* Data structures match component expectations.
* Generated data expands the dataset for realistic demonstrations.
* Reset returns the prototype to its initial state.

---

# See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [Persistence](./persistence.md) — tracks user modifications to mock data
- [Prototype Boilerplate](./boilerplate.md) — integrates mock data into prototype shell

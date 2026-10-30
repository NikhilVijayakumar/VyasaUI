# Runtime Map: Import Resolution

Maps how consumer imports resolve to source files at runtime. Only Astra's public API surface is mapped here. ThemeProvider, LanguageProvider, UI components, and design tokens resolve through the **Prati** package — see Prati's import resolution map.

```
Consumer Import                  Resolution Path
──────────────                   ────────────────
import { useDataState }
  from "astra"                     → src/lib.ts
                                     → src/common/hooks/useDataState.ts

import { AppStateHandler }
  from "astra"                     → src/lib.ts
                                     → src/common/hooks/AppStateHandler.tsx

import { ApiService }
  from "astra"                     → src/lib.ts
                                     → src/common/repo/ApiService.ts

import { ServerResponse }
  from "astra"                     → src/lib.ts
                                     → src/common/repo/ServerResponse.ts

import { StateType }
  from "astra"                     → src/lib.ts
                                     → src/common/state/AppState.ts
```

## Subpath Exports

Package.json declares the subpath mapping (Astra only):

```json
{
  "exports": {
    ".": "./src/lib.ts"
  }
}
```

Subpath exports `astra/theme` and `astra/components` no longer exist — those concerns moved to Prati.

## Internal Imports

Internal modules import from relative paths, never from the public barrel:

```typescript
// ✅ Correct internal import
import { spacing } from '../../theme/tokens/spacing';

// ❌ Wrong — would create circular dependency
import { spacing } from 'astra';
```

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/public-api-stability.md` | Only declared entry points are public |
| `core/api-surface.md` | Entry point definitions and import rules |

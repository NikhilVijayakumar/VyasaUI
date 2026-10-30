This file is the **Translation Layer**. It tells the Agent exactly how to map your high-level JavaScript/TypeScript theme objects (like `colors.neutral`) into the CSS variables used in **Astra** mockups.

---

# 🎨 Astra: MUI Token Mapping & Variable Logic

> **Version:** 1.0.0
> **Status:** Mandatory Mapping for Antigravity Agent Synthesis

## 1. Color Palette Mapping

The Agent must strictly follow the functional mapping from the React `colors.ts` and `appTheme.ts` files to CSS variables.

| React Theme Property | Astra CSS Variable | Semantic Context |
| --- | --- | --- |
| `palette.primary.main` | `--mui-primary-main` | Primary actions and highlights. |
| `palette.secondary.main` | `--mui-secondary-main` | Secondary UI elements. |
| `palette.background.default` | `--mui-bg-default` | Main page background. |
| `palette.background.paper` | `--mui-bg-paper` | Card, Modal, and Surface backgrounds. |
| `palette.text.primary` | `--mui-text-primary` | High-contrast text (Neutral 900/50). |
| `palette.text.secondary` | `--mui-text-secondary` | Subtitles and hints (Neutral 600/300). |
| `palette.divider` | `--mui-divider` | Borders and hairline separators. |

---

## 2. Dynamic Mode Overrides (Light vs. Dark)

The Agent must ensure that the mockup reacts correctly to the `[data-theme]` attribute by referencing these logic-based shifts:

* **Primary Shift:** In `dark` mode, the main color shifts from `colors.primary` to `colors.primary` for better WCAG contrast.
* **Surface Elevation:** In `dark` mode, `MuiPaper` and `MuiAppBar` must use `--mui-bg-paper` (Neutral 800-900 range) and remove all `background-image` overlays (standard MUI elevation behavior).
* **Inversion Logic:**
* `Light`: Text Primary = Neutral 900 | Divider = Neutral 200
* `Dark`: Text Primary = Neutral 50 | Divider = Neutral 700



---

## 3. Spacing & Shape Tokens

The layout engine is built on an $8px$ multiplier. Hardcoded pixel values are strictly prohibited.

| Spacing Scale | Value | CSS Variable |
| --- | --- | --- |
| `spacing` | $8px$ | `var(--mui-spacing-1)` |
| `spacing` | $16px$ | `var(--mui-spacing-2)` |
| `spacing` | $32px$ | `var(--mui-spacing-4)` |
| `borderRadius.md` | $8px$ | `var(--mui-radius-md)` |

---

## 4. Typography Variant Mapping

The Agent must use the `typography` foundation variables. Never declare a `font-size` directly in a component style.

* **Header Intent:** `h1` through `h6`.
* **Action Intent:** Use `button` variant (mapped to `fontWeight: 500` and `textTransform: none`).
* **Status Intent:** Use `caption` or `overline` for small metadata.
* **Fluid Logic:** All variants must inherit the `clamp()` values defined in `foundations/typography.css`.

---

## 5. Component-Specific Overrides

To match the React `appTheme.ts`, specific organisms must follow these "Component DNA" rules:

* **AppBar:**
* Border-bottom must be `1px solid var(--mui-divider)`.
* `background-image` must be `none`.


* **Drawer (Sidebar):**
* Must use `--mui-bg-default` for the paper background.
* Border-right must be `1px solid var(--mui-divider)`.


* **Buttons:**
* Default `borderRadius` is `var(--mui-radius-md)`.
* Text transform is always `none`.



---

## 6. Verification Anchor Tags

The Agent must inject these tags into the HTML to assist the **Verification Project**:

* **`data-mui-color`**: Applied to elements using primary/secondary colors.
* **`data-mui-variant`**: Applied to typography elements (e.g., `data-mui-variant="h5"`).
* **`data-mui-spacing`**: Applied to containers using specific gap/padding logic.

---

### Next Step for Astra

With the logic and tokens defined, the next step is to integrate these tokens into the React MUI theme provider and ensure all components reference `var(--mui-*)` CSS variables.
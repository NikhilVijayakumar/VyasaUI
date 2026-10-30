# Overview

TrendMetricCard is a compact card that displays a key metric (label + value) with an optional color-coded trend direction indicator. Designed for dashboard metric rows where multiple metrics appear side by side. Adapts to container width for flex row layouts.

# Feature Summary

- **Purpose**: Display key metric with optional trend direction indicator
- **Responsibilities**: Display metric label and value in compact card; show optional trend indicator with color-coded direction; adapt to container width
- **Non-Responsibilities**: No data fetching/calculation; no value formatting beyond as-is; no click events; no animation of trend changes; no chart/sparkline
- **Authorization**: Authenticated
- **Related**: Card (general-purpose container)

# User Goals

| Goal | Description |
| ---- | ----------- |
| Read metric | See metric name (label) and current value at a glance |
| Assess direction | See whether metric moved up, down, or stayed neutral |
| Compare metrics | Scan multiple TrendMetricCards in a row to compare performance |
| Dashboard scanning | Quickly parse key metrics without detailed chart analysis |

# User Journeys

### Entry Conditions
Developer renders TrendMetricCard with label and value; optionally provides trend value and direction.

### Primary Flow
1. Developer provides `label="Revenue"`, `value="$12,400"`, `trendValue="+8.2%"`, `trendDirection="up"`
2. Card renders with label "Revenue", value "$12,400", green up-arrow indicator with "+8.2%"
3. User scans card in dashboard row; processes metric direction at a glance via color

### Alternate Flows
- **No trend**: Developer omits `trendValue` and `trendDirection` — card renders label + value only without indicator
- **Trend without direction**: Developer provides `trendValue="3.1%"` but no `trendDirection` — indicator renders with neutral gray color
- **Unknown direction**: Developer provides `trendDirection="sideways"` (not up/down) — falls to neutral gray fallback

### Failure Flows
- **Missing label or value**: Required props absent — component cannot render meaningfully
- **Unknown direction prop**: Falls to neutral gray; no runtime error per spec

### Recovery Flows
Developer provides required label and value; uses valid direction values (`up`, `down`).

### Exit Conditions
User reads metric and trend; continues scanning other metrics in the dashboard row.

| Journey | Description |
| ------- | ----------- |
| Metric with trend | Label, value, and color-coded trend direction displayed |
| Metric without trend | Only label and value; no trend indicator |
| Neutral direction | Trend value shown with neutral gray indicator |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| Dashboard metric row | TrendMetricCard rendered inline with sibling cards in a flex row |

# Interaction Design

| Interaction | Trigger | Behavior |
| ----------- | ------- | -------- |
| None | N/A | No click events, hovers, or keyboard interactions |

TrendMetricCard is a read-only display component — no user interaction.

# Form Design

No form fields. All values are display-only props.

# UX State Design

| State | User Experience | Trigger |
| ----- | --------------- | ------- |
| Loaded | Label and value rendered in compact card | `label` and `value` provided |
| With trend | Label + value + trend indicator with color-coded direction arrow | `trendValue` and `trendDirection` provided |
| Without trend | Only label + value; no indicator rendered | `trendValue` or `trendDirection` absent |

**Quality Checklist**: LOADING — not applicable (no data fetching); ERROR — unknown direction falls to neutral gray; EMPTY — not applicable (label+value required).

# Feedback Design

| Event | Feedback | Mechanism |
| ----- | -------- | --------- |
| Metric renders | Label and value displayed in card | Conditional rendering of label/value elements |
| Trend renders | Arrow icon + percentage with direction color | Conditional rendering; `trendDirection="up"` → green `--color-trend-up`, `down` → red `--color-trend-down`, else neutral `--color-trend-neutral` |
| Unknown direction | Neutral gray color applied | Fallback in direction color mapping |
| Container resize | Card width adjusts to parent flex layout | Fluid width via flex properties |

# Navigation Design

| Path | Behavior |
| ---- | -------- |
| Dashboard → TrendMetricCard | Card rendered inline in metric row parent |
| TrendMetricCard → parent | No navigation; passive display |

No click events, links, or internal navigation.

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop (≥768px) | Inline flex item with flex-grow; equal width distribution in row; label above value |
| Tablet (480–768px) | Same as desktop; text size unchanged |
| Mobile (≤480px) | Flex row may wrap to two columns; cards shrink to fit; label/value stack vertically |

# Accessibility Design

| Requirement | Implementation |
| ----------- | -------------- |
| Semantic HTML | Card uses `article` or `div` with `role="group"`; label uses `dt` or `span` with `aria-label` context |
| Color reliance | Trend direction communicated via arrow icon AND color — not color alone |
| Contrast | Trend colors meet 4.5:1 against card background: `--color-trend-up` (#16a34a green), `--color-trend-down` (#dc2626 red), `--color-trend-neutral` (#6b7280 gray) |
| Screen reader | `aria-label` on card: "Revenue: $12,400, up 8.2 percent" |
| Focus | No focus targets — read-only display |
| Zoom | Text scales with browser zoom without loss |

# Localization Design

| Key Pattern | Example | Scope |
| ----------- | ------- | ----- |
| `trendMetricCard.trendUp` | "up" | Screen reader label suffix for up direction |
| `trendMetricCard.trendDown` | "down" | Screen reader label suffix for down direction |
| `trendMetricCard.trendNeutral` | "no change" | Screen reader label suffix for neutral direction |

`label` and `value` provided as props by parent — not hardcoded. Trend direction for screen reader uses localized direction labels.

# Design System Traceability

| Rule | Application |
| ---- | ----------- |
| Radical Simplicity | No data fetching, formatting, clicks, animation, charts — label + value + optional trend only |
| Typography Leads | Label uses `--font-label` (uppercase, 11px/12px); value uses `--font-display` (24px/32px); trend uses `--font-body-sm` |
| White Space is Feature | 16px internal padding; 8px gap between label and value; 8px gap between value and trend |
| Color System | Trend colors via CSS variables: `--color-trend-up` (green), `--color-trend-down` (red), `--color-trend-neutral` (gray); label `--color-text-secondary`; value `--color-text-primary` |
| Accessibility | Direction arrow + color (not color alone); `aria-label` with combined metric summary; 4.5:1 contrast |
| Localization | `trendMetricCard.*` key naming for screen reader prefixes |
| 8px Grid | Internal spacing 8px between elements; padding 16px; all multiples of 8 |
| Premium UI — Minimal Form Layouts | Compact single-purpose card with clean label/value/trend alignment |
| Quality Checklist | LOADING (N/A), ERROR (unknown direction → neutral fallback), EMPTY (label+value required — required props guard) |

# Open Questions

- Should `trendDirection` accept only `"up"` | `"down"` as valid values, or is any string accepted with unknown → neutral fallback?
- Should the component enforce `label` and `value` as required at the type level (TypeScript), or remain prop-based validation?
- Is the screen reader `aria-label` format standardized across all metric cards, or does each card construct its own label from parts?

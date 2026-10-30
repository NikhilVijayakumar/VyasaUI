# Design system grill

Status: independent review and recommendations; user interview in progress. Recommendations are proposals, not approved requirements. They apply to the local [design-system knowledge](../../../knowledge/design-system/index.md). The first mockup workflow and visual identity are still open.

## Intent and audience

**Q1. What must the interface make easy?** Developers and portfolio maintainers need to find projects, compare information and understand why a result is trustworthy. An overly decorative dashboard can obscure the evidence.

**Recommendation:** Design around a searchable project list and a clear project detail/evidence view, with workspace and index status available nearby. Treat this as a test scenario for the design system, not an approved navigation structure. Verify users can locate a project and explain a displayed fact without relying on color.

**Q2. How much information should fit?** A spacious marketing layout wastes desktop space, while excessive density makes status and evidence hard to read.

**Recommendation:** Start with a comfortable desktop density and clear row spacing; test a representative large project list at normal zoom and a narrower window before introducing an optional compact mode. No fixed number of rows is promised.

## Scope and visual identity

**Q3. Does Prati's sample brand define Vyasa's identity?** Its colors and logo are library examples, not an approved Vyasa brand.

**Recommendation:** Use Prati's existing semantic tokens and neutral foundations for the first mockup. Keep brand color, logo and typography overrides centralized in the theme and leave final identity open. Test light and dark variants; choose the initial default only after user review.

**Q4. Which components should be custom?**

**Recommendation:** Use Prati's public components for navigation, tables, forms and feedback. Compose domain-specific project and evidence screens in Vyasa UI. If a reusable component is missing or defective, specify and fix it in Prati rather than replacing it locally. Verify installed exports and behavior before promising a component.

## Behavior and data

**Q5. What happens when no projects are shown?** No matches, an unconfigured workspace, an empty index, a failed query and an unavailable backend are different conditions.

**Recommendation:** Give each a distinct state with an explanation and a contextual next action only when that action is actually available. Preserve existing data during refresh where the contract permits and identify it as stale or partial when appropriate. Exercise all states in mockups with labeled sample data.

**Q6. How are evidence and uncertainty communicated without clutter?**

**Recommendation:** Show a concise status and source cue beside important facts, with detailed provenance on demand. Distinguish observed, declared, unknown, not detected, inaccessible, stale, unsupported and conflicting when supplied; never collapse unknown into false. Use text and icons as well as color. Verify with examples of conflicting and inaccessible data.

**Q7. How are potentially consequential actions presented?**

**Recommendation:** Clearly label refresh and configuration actions, show progress and partial failures, and request confirmation when an operation's defined consequences warrant it. Queries must not appear to trigger scans. Do not add delete or archive actions merely because candidates are shown. Exact operations and confirmation rules await their requirements and backend contract.

## Desktop architecture and integration

**Q8. What does the renderer own?**

**Recommendation:** Keep reusable views presentational, use Astra hooks for async state, and place data access behind feature repositories. Keep privileged desktop operations behind a narrow validated Electron bridge. Do not decide the backend transport or claim a bridge exists until its contract is designed and implemented.

**Q9. What if the window is resized, zoomed or offline?**

**Recommendation:** Preserve navigation and essential actions at the supported minimum window size and at increased text scaling, using scrolling or progressive disclosure instead of clipped controls. Distinguish offline/backend-unavailable from zero results. Confirm the actual supported window sizes and zoom levels during acceptance planning.

## Accessibility and localization

**Q10. What is the minimum verification before accepting a screen?**

**Recommendation:** Test keyboard-only operation and visible focus, semantic labels, status announcements, text and control contrast in both themes, reduced motion, resizing and zoom. Use 4.5:1 for normal text and 3:1 for large text and applicable non-text controls as initial contrast targets; verify against the applicable accessibility standard for the actual UI. Record checks and exceptions rather than inferring accessibility from component choice.

**Q11. Which languages and directionality are required?**

**Recommendation:** Externalize interface strings via Prati's language provider, avoid layouts that assume fixed text length, and use locale-aware date/number formatting. Begin with the agreed initial language; do not claim translated or right-to-left support without actual translations and verification. Language selection remains open.

## Acceptance, alternatives and reversibility

**Q12. How should mockups relate to implementation?**

**Recommendation:** Use realistic, clearly labeled sample project data and include populated, empty, partial and failure cases. Map mockup components to Prati and theme tokens so the visual design can be implemented without implying live backend functionality. Review screenshots at representative desktop sizes in both themes.

**Q13. What if a Prati token or component cannot meet a requirement?**

**Recommendation:** First check supported theme overrides and component composition. If a shared Prati capability is missing or incorrect, record a reproducible requirement and fix Prati itself, then verify the updated dependency and its consumer. Application-specific brand configuration uses the supported theme API; it does not replace a Prati feature.

## Decisions needed

- Primary user and first workflow; which project information deserves immediate prominence.
- Vyasa visual identity and default theme.
- Supported minimum window size, zoom and language coverage.
- Available UI actions and the actual Vyasa integration contract.
- Whether dense data views need a user-selectable compact mode.

Each decision should be recorded with an owner and date when answered. Proposed behavior should be converted into testable frontend requirements and OpenSpec changes before implementation.

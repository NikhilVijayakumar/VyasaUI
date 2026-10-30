# Astra — Design Quality Checklist

This checklist should be applied to every screen, component, or interface before release.

The goal is to ensure the design feels **intentional, refined, and premium**.

---

# 1. Clarity of Purpose

Ask:

• Is the purpose of the screen immediately clear?
• Can a user understand the main action within seconds?

Remove any elements that do not support the core task.

**Standard:**
Users should immediately understand what the screen is for.

---

# 2. Visual Hierarchy

Verify that the hierarchy is clear.

Check:

• Is the most important information visually dominant?
• Are secondary elements clearly subordinate?

Hierarchy should be created through:

* typography
* spacing
* contrast

Avoid relying on color alone.

---

# 3. Spacing Consistency

Check all spacing across the layout.

Ensure:

• margins are consistent
• internal spacing is balanced
• elements align to the grid

Small spacing inconsistencies can reduce perceived quality.

**Standard:**
Spacing should feel engineered rather than improvised.

---

# 4. Alignment Precision

Verify that all elements are aligned.

Check:

• text baselines
• component edges
• grid alignment

Misalignment creates visual tension and reduces polish.

---

# 5. Typography Quality

Evaluate the typography.

Check:

• line height is comfortable
• font weights are consistent
• headings and body text are clearly differentiated

Avoid:

* too many font weights
* dense text blocks

---

# 6. Color Discipline

Ensure color is used intentionally.

Verify:

• accent colors highlight key actions
• neutral colors dominate the interface
• color meaning is consistent

Avoid decorative color usage.

---

# 7. Component Consistency

Confirm that components follow established patterns.

Check:

• buttons look consistent across screens
• cards follow the same layout logic
• form elements behave predictably

Consistency builds trust and familiarity.

---

# 8. Interaction Clarity

Evaluate interactive elements.

Ask:

• Is it clear what is clickable?
• Do buttons and actions stand out appropriately?

Interactive elements should be easily identifiable without confusion.

---

# 9. Visual Balance

Assess the overall balance of the layout.

Check:

• distribution of elements
• spacing between sections
• visual weight across the screen

A balanced layout should feel calm and stable.

---

# 10. White Space Quality

Examine the use of space.

Ensure:

• content has room to breathe
• sections are clearly separated
• layouts do not feel crowded

Whitespace improves readability and focus.

---

# 11. Motion and Feedback

Check interaction feedback.

Ensure that:

• hover states are visible
• transitions are smooth
• system feedback is clear

Motion should enhance usability, not distract from it.

---

# 12. Detail Polish

Inspect small details carefully.

Check:

• icon alignment
• text truncation
• corner radii consistency
• subtle spacing differences

Premium quality is often defined by small details.

---

# 13. Accessibility Readability

Verify readability and accessibility.

Ensure:

• text contrast is sufficient
• font sizes are readable
• interactive targets are comfortable to use

Accessibility improves usability for all users.

---

# 14. Focus and Simplicity

Review the screen once more.

Ask:

• Is anything unnecessary still present?
• Can the layout be simplified further?

Premium design often emerges through **careful removal**.

---

# 15. Huashu Anti-AI-Slop Check

Astra designs must be intentional, non-generic, and crafted. Before release, confirm:

• No decorative empty states — every element has a clear purpose
• No MUI default theme overrides passing as finished design
• No placeholder data (`lorem ipsum`) masquerading as real content
• Visual hierarchy driven by content structure, not decoration
• No stock or generic icons used without functional purpose
• No unused component variants or props left in the implementation
• Color palette uses only tokens from the design system — no invented colors
• Typography uses only scale variants — no inline `font-size` declarations
• All three non-success states are handled: LOADING, ERROR, EMPTY (not just SUCCESS)
• Components present 2–3 visual variants before locking direction

---

# Final Approval Standard

Before shipping a design, confirm:

• The layout feels balanced
• The hierarchy is immediately clear
• Spacing and alignment are precise
• Interactions are intuitive
• The interface feels calm and refined

If a screen feels **visually effortless**, it has likely achieved the Astra quality standard.

---


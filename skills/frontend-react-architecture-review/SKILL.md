---
name: frontend-react-architecture-review
description: Review React boundaries, state ownership, dependencies and public contracts.
metadata:
  scope: frontend
---

# frontend-react-architecture-review

Inspect implementation, tests, public exports and existing knowledge before deciding on boundaries. Keep reusable UI independent of consumer-specific routing, authentication and business rules. Consider controlled and uncontrolled APIs, provider ownership, compatibility, rendering and composition. Account for the prototype runtime's navigation and mock persistence as separate responsibilities. Verify available affected consumers and record gaps; do not assume a router, API client or Storybook exists.

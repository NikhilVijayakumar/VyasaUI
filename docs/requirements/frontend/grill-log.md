# Frontend grill log

Status: interview in progress. Questions are open until answered; backend recommendations are not automatically user decisions.

The owner clarified that Vyasa UI and Vyasa share product and domain knowledge and functional scope. CLI and MCP server functionality is backend-only; frontend architecture uses Astra and Prati. See the [coverage map](backend-coverage.md). The owner has not yet selected the first user workflow or mockup slice.

| ID | Dimension | Question | Status |
|---|---|---|---|
| Q1 | User and problem | Who is the primary user of the first mockup, and what is the first task they should complete? | Asked; awaiting answer |
| Q2 | Scope | Which backend capabilities are needed in the first mockup, and which can wait? | Open |
| Q3 | Workflow | What should users see first when there are no indexed projects or no configured workspace? | Open |
| Q4 | Data | What evidence, freshness, and unknown-state details must be visible without opening a project? | Open |
| Q5 | Operations | Which actions may users initiate from the UI, including discovery and refresh, and what feedback is needed? | Open |
| Q6 | Integration | How should the UI locate, start, and communicate with Vyasa, and what happens if it is unavailable or incompatible? | Open |
| Q7 | Ownership | Which metadata, if any, may users edit through the UI, and where is it authoritative? | Open |
| Q8 | Privacy and failure | What local information may be displayed, copied, exported, or shared, and how are partial failures represented? | Open |
| Q9 | Acceptance | What concrete workflow and observable result will make the first mockup successful? | Open |
| Q10 | Design | What references, screen priorities, and platform constraints should guide the mockup? | Open |

Backend decisions listed in Vyasa's decisions-for-review remain backend-owned. Resolve frontend choices independently and record any dependency on an unresolved backend decision.

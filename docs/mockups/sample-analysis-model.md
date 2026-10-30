# Analysis and review example

The populated sample in the mockup is fictional; it is not an analysis of any real checkout. The same example assessment is used for accessible sample projects so the detail layouts can be explored; an inaccessible sample remains unknown. Its data is maintained in [sample-analysis.js](sample-analysis.js). The structure is a UI proposal, not a confirmed backend schema.

## Separate kinds of status

| Kind | Example values in the mockup | What it answers |
|---|---|---|
| Deterministic scan | Completed with gaps; inaccessible/unknown on other examples | What the scan could inspect and when. |
| External agent analysis | Completed; coverage is partial | What an external agent reported, its source and scope. Completion is not human verification. |
| Finding data | Observed, unknown, inaccessible, or agent assessment | How the information was established. |
| Human review | Not reviewed, verified, needs follow-up, feedback requested, rejected | What a person concluded about a finding; it does not alter the underlying evidence. |

The mockup shows an example of each of the first three positive human-review states: verified, needs follow-up and feedback requested. A finding can also be set to not reviewed or rejected. These are proposed UI labels, not established backend enumerations.

## Example record

Each example finding has an identifier, title, value, origin (deterministic scan or external agent report), evidence reference, observation or assessment status, human-review status, and feedback. The overall analysis example also records time, sample revision, source, author, coverage and verification status. A user can edit the sample finding's review and feedback.

External coding-agent work happens outside this application. After that work, a user may explicitly scan the project to refresh indexed information. The mockup does not track the external analysis workflow.

For the real application, storage ownership, agent-report format, identity, status vocabulary, revision binding, timestamps, feedback history, and authorization still need a confirmed contract. Do not treat the prototype's object structure as that contract.

## ADDED Requirements

### Requirement: Browse project data
The application SHALL allow users to browse supported projects and open their details, preserving unknown, inaccessible and stale states.

#### Scenario: Select a project
- **WHEN** the user selects an indexed project
- **THEN** the application displays available backend observations and their provenance

#### Scenario: View profile context
- **WHEN** the user opens profile context for the selected project
- **THEN** the application displays its indexed context, source, workflow guidance, and review findings returned by the backend

#### Scenario: Switch projects while details load
- **WHEN** a response for a previously selected project arrives after selection changes
- **THEN** its content is not displayed as the currently selected project's evidence

### Requirement: Use the established frontend libraries
The application SHALL use Astra public state and IPC capabilities and Prati public providers and components for their respective shared responsibilities.

#### Scenario: Project results load
- **WHEN** a supported project query completes
- **THEN** the renderer presents the result through the application's Astra and Prati integration

### Requirement: Browse by workspace or technology
The application SHALL offer separate workspace and technology project views using backend-provided workspace and technology information. The workspace view SHALL allow all configured workspaces or one workspace to be selected; the technology view SHALL allow a technology to be selected without a workspace filter. Both views SHALL open project details directly.

#### Scenario: Select a workspace
- **WHEN** a user selects a configured workspace
- **THEN** the project list contains only projects returned by the backend for that workspace

#### Scenario: Browse by technology
- **WHEN** a user selects a technology
- **THEN** the project list contains projects matching that technology across workspaces

# Desktop shell

## Purpose

Launch the Vyasa UI desktop window and show whether the local integration is configured.

## Requirements

### Requirement: Launch the desktop shell
The application SHALL open a desktop window displaying the Vyasa UI name and an indication that the Vyasa integration is not configured.

#### Scenario: Start the application
- **WHEN** the application starts
- **THEN** a Vyasa UI window is displayed
- **AND** the window indicates that the Vyasa integration is not configured

### Requirement: Isolate the renderer
The renderer SHALL run with context isolation and without Node integration.

#### Scenario: Renderer loads
- **WHEN** the desktop window loads its renderer
- **THEN** Node integration is disabled and context isolation is enabled

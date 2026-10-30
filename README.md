# Vyasa UI

An Electron desktop shell for Vyasa, the workspace intelligence MCP server. Prati provides UI components and Astra provides application state and MVVM utilities. This initial shell is a foundation for a later mockup; it does not yet connect to Vyasa.

## Development

Requires Node.js 22 or newer and npm. Install dependencies with `npm install`, then run `npm run dev`. Use `npm run build` to type-check and build, and `npm start` to preview the build. Astra and Prati are GitHub-hosted dependencies and installation requires access to their repositories.

Product knowledge is in [knowledge](knowledge/index.md); intended behavior is in [OpenSpec](openspec/specs/desktop-shell/spec.md). Specify the Vyasa transport and lifecycle before implementing the integration. Never commit local environment files or credentials.

Frontend requirements and interview questions are in [docs/requirements](docs/requirements/README.md). Shared product knowledge is sourced from Vyasa's backend repository.

The Vyasa knowledge and requirement packages are maintained locally as a baseline; their backend implementation details remain backend-specific. Astra and Prati architecture and design documentation is also included under [docs/reference](docs/reference/README.md), independently of the other repositories.

## Graphify

Install the repository-local tool with `python -m venv .venv` and `.venv\Scripts\python -m pip install -r requirements-tools.txt` on Windows. Activate the virtual environment or run `.venv\Scripts\graphify update .` after code changes.

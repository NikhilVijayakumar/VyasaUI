import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from 'astra';
import { ThemeProvider, LanguageProvider, lightTheme, darkTheme, LoadingState, ErrorState, EmptyState } from 'prati';
import { Desktop } from './desktop';

const translations = { en: {
  'app.title': 'Vyasa', 'app.tagline': 'Workspace intelligence',
  'nav.workspaces': 'Workspaces', 'nav.technologies': 'Technologies', 'nav.settings': 'Settings',
  'projects.title': 'Explore projects', 'projects.caption': 'Find projects and understand the evidence behind them.',
  'projects.search': 'Search projects', 'projects.technology': 'Technology', 'projects.allTechnologies': 'All technologies', 'projects.apply': 'Search',
  'projects.empty': 'No projects match this query.', 'projects.more': 'Load more',
  'project.choose': 'Select a project to see its indexed details.', 'project.evidence': 'Project evidence',
  'project.observations': 'Indexed observations', 'project.report': 'Project report', 'project.dependencies': 'Dependencies', 'project.details': 'Project details',
  'project.overview': 'Overview', 'project.profile': 'Profile', 'project.context': 'Profile context', 'project.review': 'Review candidates',
  'project.contextDescription': 'Indexed evidence and guidance for an external coding agent. Review findings before taking action.',
  'project.metadata': 'Repository observations', 'project.name': 'Name', 'project.scope': 'Scope', 'project.source': 'Source',
  'project.resolution': 'Resolution', 'project.constraint': 'Constraint', 'project.coverage': 'Coverage',
  'index.status': 'Index status', 'index.refresh': 'Scan workspaces', 'index.confirm': 'Choose the workspace scope to scan.',
  'index.scan': 'Run scan', 'index.cancel': 'Cancel', 'index.running': 'Scanning configured workspaces…',
  'index.completed': 'Scan finished', 'index.partial': 'Scan completed with warnings',
  'index.failed': 'Scan failed', 'project.scan': 'Scan project', 'project.scanConfirm': 'Scan the indexed checkouts for this project?',
  'project.scanning': 'Scanning project…', 'project.scanOutcomes': 'Checkout outcomes',
  'settings.title': 'Backend connection', 'settings.select': 'Select Vyasa CLI', 'settings.version': 'Backend version',
  'settings.description': 'Choose the installed Vyasa executable. Its adjacent data directory holds the local index.',
  'settings.uiVersion': 'UI version', 'settings.pending': 'Not available',
  'common.retry': 'Retry', 'common.close': 'Close', 'common.loading': 'Loading…', 'common.error': 'Unable to load data',
  'common.unknown': 'Unknown', 'common.back': 'Back', 'common.unavailable': 'Not available',
  'technology.help': 'Choose a supported technology to find matching projects across workspaces.',
  'workspace.help': 'Choose all workspaces or one configured root.', 'workspace.select': 'Workspace', 'workspace.all': 'All workspaces',
  'workspace.nameAction': 'Name workspace', 'workspace.nameTitle': 'Name workspace', 'workspace.nameLabel': 'Workspace name',
  'workspace.nameHelp': 'Names are stored locally. The workspace root remains unchanged.', 'workspace.save': 'Save name',
  'report.empty': 'No report information is available.', 'data.source': 'Backend response',
  'scan.unsupported': 'Project-specific scanning is unavailable with the selected backend.',
  'analysis.external': 'Deeper analysis is performed in an external coding agent; refresh the index after its work is complete.'
} };
function App(): React.JSX.Element {
  return <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
    <LanguageProvider translations={translations} availableLanguages={[{ code: 'en', label: 'English' }]} defaultLanguage="en">
      <AppStateProvider value={{ Loading: LoadingState, Error: ({ message }) => <ErrorState message={message} />, Empty: EmptyState }}>
        <Desktop />
      </AppStateProvider>
    </LanguageProvider>
  </ThemeProvider>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

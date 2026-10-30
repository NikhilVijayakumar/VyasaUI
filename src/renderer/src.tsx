import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from 'astra';
import { ThemeProvider, LanguageProvider, lightTheme, darkTheme, LoadingState, ErrorState, EmptyState } from 'prati';
import { Box, Container, Typography } from '@mui/material';

function App(): React.JSX.Element {
  return <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
    <LanguageProvider translations={{ en: {} }} availableLanguages={[{ code: 'en', label: 'English' }]} defaultLanguage="en">
      <AppStateProvider value={{ Loading: LoadingState, Error: ({ message }) => <ErrorState message={message} />, Empty: EmptyState }}>
        <Container maxWidth="md"><Box sx={{ py: 8 }}><Typography variant="overline">Workspace intelligence</Typography><Typography variant="h3" component="h1">Vyasa UI</Typography><Typography sx={{ mt: 2 }}>Desktop foundation ready for the Vyasa mockup.</Typography><Typography sx={{ mt: 1 }} color="text.secondary">Vyasa integration has not been configured yet.</Typography></Box></Container>
      </AppStateProvider>
    </LanguageProvider>
  </ThemeProvider>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

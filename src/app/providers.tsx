'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    allVariants: {
      color: 'black',
    },
    h1: {
      color: 'black',
    },
    h2: {
      color: 'black',
    },
    h3: {
      color: 'black',
    },
    h4: {
      color: 'black',
    },
    h5: {
      color: 'black',
    },
    h6: {
      color: 'black',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'black',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
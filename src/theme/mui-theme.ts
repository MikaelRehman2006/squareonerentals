import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme that ensures all text is black
export const theme = createTheme({
  palette: {
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  typography: {
    allVariants: {
      color: '#000000',
    },
    h1: { color: '#000000' },
    h2: { color: '#000000' },
    h3: { color: '#000000' },
    h4: { color: '#000000' },
    h5: { color: '#000000' },
    h6: { color: '#000000' },
    subtitle1: { color: '#000000' },
    subtitle2: { color: '#000000' },
    body1: { color: '#000000' },
    body2: { color: '#000000' },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: 'black',
      },
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
  },
});

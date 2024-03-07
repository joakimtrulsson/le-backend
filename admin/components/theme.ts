import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: '2rem',
          padding: '1rem',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h5: {
          color: '#fff',
          fontWeight: 600,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecee',
          borderRadius: '16px',
          marginBottom: '2rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#036b9c',
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: 26,
      fontWeight: 600,
      lineHeight: 78 / 70,
      letterSpacing: -0.2,
    },
    subtitle1: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 600,
      opacity: 0.7,
    },
    subtitle2: {
      fontSize: 26,
      color: '#fff',
      fontWeight: 600,
      opacity: 1,
    },
  },
});

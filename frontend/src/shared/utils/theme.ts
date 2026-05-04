import { alpha, createTheme, ThemeOptions } from '@mui/material/styles';

export const brand = {
  50: '#FFF7ED',   
  100: '#FFEDD5',  
  200: '#FED7AA',  
  300: '#FDBA74',  
  400: '#FB923C',  
  500: '#F54A00',  
  600: '#E04300',  
  700: '#B83700',  
  800: '#902C00',  
  900: '#671F00',  
};

export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
};

export const slate = {
  50:  "hsl(210, 40%, 98%)",  
  100: "hsl(210, 40%, 96%)",  
  200: "hsl(214, 32%, 91%)",  
  300: "hsl(213, 27%, 84%)",  
  400: "hsl(215, 20%, 65%)",  
  500: "hsl(215, 20%, 56%)",  
  600: "hsl(215, 25%, 35%)",  
  700: "hsl(215, 32%, 26%)",  
  800: "hsl(217, 33%, 17%)",  
  900: "hsl(220, 40%, 10%)",  
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

const baseTheme: ThemeOptions = {
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,  // Tailwind's sm
      md: 768,  // Tailwind's md
      lg: 1024, // Tailwind's lg
      xl: 1280, // Tailwind's xl
    },
  },
  typography: {
    fontFamily: '"Instrument Sans", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    h1: {
      fontSize: '2.25rem', 
      fontWeight: 600,
      color: gray[800],
    },
    h2: {
      fontSize: '1.875rem', 
      fontWeight: 600,
      color: gray[800],
    },
    h3: {
      fontSize: '1.5rem', 
      fontWeight: 500,
      color: gray[800],
    },
    h4: {
      fontSize: '1.25rem', 
      fontWeight: 500,
      color: gray[800],
    },
    h5: {
      fontSize: '1rem', 
      fontWeight: 500,
      color: gray[800],
    },
    h6: {
      fontSize: '0.875rem', 
      fontWeight: 500,
      color: gray[800],
    },
    body1: {
      fontSize: '1rem', 
      color: gray[800],
    },
    body2: {
      fontSize: '0.875rem', 
      color: gray[800],
    },
  },
};


export const lightTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'light',
        primary: {
          light: brand[200],
          main: brand[400],
          dark: brand[700],
          contrastText: brand[50],
        },
        info: {
          light: brand[100],
          main: brand[300],
          dark: brand[600],
          contrastText: gray[50],
        },
        warning: {
          light: orange[300],
          main: orange[400],
          dark: orange[800],
        },
        error: {
          light: red[300],
          main: red[400],
          dark: red[800],
        },
        success: {
          light: green[300],
          main: green[400],
          dark: green[800],
        },
        grey: {
          ...gray,
        },
        divider: alpha(gray[300], 0.4),
        background: {
          default: "#fff",
          paper: "#fff",

        },
        text: {
          primary: gray[800],
          secondary: gray[600],
        },
        action: {
          hover: alpha(gray[200], 0.2),
          selected: `${alpha(gray[200], 0.3)}`,
        },
    },
    components: {
      MuiCssBaseline: {},
      MuiOutlinedInput: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: '#ffffff', 
            '& fieldset': {
              borderColor: '#e5e7eb', 
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F54A00', 
              boxShadow: '0 0 0 1px rgb(251 146 60 / 30%)',
            },
          },
          input: {
            color: '#1f2937', 
          },
        }
      },
      MuiSelect: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
    }
});

export const darkTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'dark',
        primary: {
          contrastText: brand[50],
          light: brand[500],
          main: brand[600],
          dark: brand[700],
        },
        info: {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        },
        warning: {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        },
        error: {
          light: red[400],
          main: red[500],
          dark: red[700],
        },
        success: {
          light: green[400],
          main: green[500],
          dark: green[700],
        },
        grey: {
          ...slate,
        },
        divider: alpha(slate[600], 0.6),
        background: {
          default: slate[800],
          paper: slate[700],
        },
        text: {
          primary: "hsl(0, 0%, 100%)",
          secondary: slate[400],
        },
        action: {
          hover: alpha(slate[600], 0.2),
          selected: alpha(slate[600], 0.3),
        },
    },
    components: {
      MuiCssBaseline: {},
      MuiTablePagination: {
        styleOverrides: {
          root: {
            backgroundColor: slate[800], 
            color: slate[100], 
            fontSize: '0.875rem', 
          },
          toolbar: {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
          select: {
            color: slate[100],
             backgroundColor: slate[800],
            '&:focus': {
              backgroundColor: slate[800], 
            },
          },
          selectIcon: {
            color: slate[100],
          },
          actions: {
            color: slate[100],
            '& .MuiIconButton-root': {
              color: slate[400], 
              '&:hover': {
                color: '#F54A00', 
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: '#1e293b', 
            '& fieldset': {
              borderColor: '#334155', 
            },
            '&:hover fieldset': {
              borderColor: '#64748b', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F54A00', 
              boxShadow: '0 0 0 1px rgb(251 146 60 / 30%)',
            },
          },
          input: {
            color: slate[100], 
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: slate[800], 
          },
        },
      },
      MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: slate[800], 
          color: slate[100], 
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: slate[200],
            '&:hover': {
              backgroundColor: slate[300],
            },
          },
        },
      },
    },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: slate[100],
            fontWeight: 600,
            fontSize: '0.875rem',     
            borderBottom: '1px solid',
            borderColor: slate[700],
            backgroundColor: slate[700],
          },
          body: {
            color: slate[200], 
            background: slate[700],
            fontSize: '0.875rem',
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: slate[800], 
            color: slate[100], 
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: slate[700], 
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: slate[500], 
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F54A00', 
              boxShadow: '0 0 0 1px rgb(251 146 60 / 30%)',
            },
          },
          icon: {
            color: slate[100], 
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
    }
});
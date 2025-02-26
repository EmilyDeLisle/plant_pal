import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

export const plappTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#b872c2',
      main: '#A74FB3',
      dark: '#74377d',
      contrastText: '#fff',
    },
    text: {
      primary: '#498877',
    },
  },
  typography: {
    fontFamily: [
      'Open Sans',
      'Roboto',
      'Roboto Mono',
      '"Helvetica Neue"',
      'Arial',
      'Lobster',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h3: {
      fontSize: 72,
      fontWeight: 800,
    },
    h4: {
      fontSize: 48,
      fontWeight: 800,
    },
    h5: {
      fontSize: 22,
      fontWeight: 800
    }
  },
})

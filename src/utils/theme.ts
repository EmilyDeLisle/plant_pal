import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

export const plappTheme = createMuiTheme({
  typography: {
    fontFamily: [
      'Open Sans',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    //   h5: {
    //     fontSize: 30,
    //     fontWeight: 800,
    //     [theme.breakpoints.up('md')]: {
    //       fontSize: '2.4rem',
    //     },
    //   }
  },
})

plappTheme.typography.h5 = {
  fontSize: 22,
  fontWeight: 800,
  [plappTheme.breakpoints.up('md')]: {
    fontSize: 30,
  },
}

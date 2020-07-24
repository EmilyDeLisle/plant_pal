import React from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MomentUtils from '@date-io/moment'
import { Router } from '@reach/router'
import { Provider } from 'mobx-react'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './firebase'
import { plantStore } from './injectables'
import { NotFound, Plants, SignIn } from './components'
import { plappTheme } from './utils'

function App() {
  return (
    <MuiThemeProvider theme={plappTheme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Provider plantStore={plantStore}>
            <Router>
              <AuthProvider path="/">
                <Plants path="/plants" />
                <SignIn path="/" />
                <NotFound default />
              </AuthProvider>
            </Router>
          </Provider>
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}

export default App

import React from 'react'
import { Router } from '@reach/router'
import { Provider } from 'mobx-react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MomentUtils from '@date-io/moment'
import { AuthProvider } from './firebase'
import { plantStore } from './injectables'
import { Plants } from './plants'
import { NotFound, SignIn } from './components'
import { plappTheme } from './utils'

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={plappTheme}>
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
      </MuiThemeProvider>
    </div>
  )
}

export default App

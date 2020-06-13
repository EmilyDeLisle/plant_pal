import React from 'react'
import { Router } from '@reach/router'
import { Provider } from 'mobx-react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MomentUtils from '@date-io/moment'
import { plantStore } from './injectables'
import { Plants } from './plants'
import { SignIn } from './sign-in'
import { plappTheme } from './utils'

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={plappTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Provider plantStore={plantStore}>
            <Router>
              <Plants path="/plants" />
              <SignIn path="/" />
            </Router>
          </Provider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </div>
  )
}

export default App

import React from 'react'
import { Router } from '@reach/router'
import { Provider } from 'mobx-react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { plantStore } from './injectables'
import { Plants } from './plants'
import { SignIn } from './sign-in'

function App() {
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider plantStore={plantStore}>
          <Router>
            <Plants path="/plants" />
            <SignIn path="/" />
          </Router>
        </Provider>
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default App

import React from 'react'
import { Router } from '@reach/router'
import { Provider } from 'mobx-react'
import { plantStore } from './injectables'
import { Plants } from './plants'
import { SignIn } from './sign-in'

function App() {
  return (
    <div className="App">
      <Provider plantStore={plantStore}>
        <Router>
          <Plants path="/plants" />
          <SignIn path="/" />
        </Router>
      </Provider>
    </div>
  )
}

export default App

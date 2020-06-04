import React from 'react'
import { Router } from '@reach/router'
import { Plants } from './plants'
import { SignIn } from './sign-in'

function App() {
  return (
    <div className="App">
      <Router>
        <Plants path="/plants"/>
        <SignIn path="/"/>
      </Router>
    </div>
  )
}

export default App

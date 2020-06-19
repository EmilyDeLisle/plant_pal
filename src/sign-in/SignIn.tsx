import React, { ReactElement, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { getAuth } from '../firebase'

export const SignIn = (props: RouteComponentProps): ReactElement => {
  const [isSignInMode, setSignInMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const action = isSignInMode ? 'Sign in' : 'Sign up'
  const auth = getAuth()

  const toggleSignInMode = () => {
    setSignInMode(!isSignInMode)
  }

  const handleSubmit = () => {
    if (!!email && !!password) {
      isSignInMode
        ? auth.signIn(email, password, () => console.log('Successfully signed in'))
        : auth.signUp(email, password, () => console.log('Successfully signed up'))
    }
  }

  return (
    <div className="sign-in__container">
      <Card>
        <div className="sign-in__fields">
          <Typography variant="h3">Plant Pal</Typography>
          <Typography>{action}</Typography>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
          <Button onClick={handleSubmit}>{action}</Button>
          <Typography variant="body2" color="textSecondary">
            {isSignInMode ? "Don't have an account? " : 'Have an account? '}
            <Link onClick={() => toggleSignInMode()}>{action}</Link>.
          </Typography>
        </div>
      </Card>
    </div>
  )
}

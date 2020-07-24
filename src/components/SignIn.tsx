import React, { ReactElement, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { getAuth } from '../firebase'
import { SignInFormValues, SignUpFormValues } from '../models'
import { UnauthedRoute } from './UnauthedRoute'

export const SignIn = (props: RouteComponentProps): ReactElement => {
  const [mode, setMode] = useState<'Sign in' | 'Sign up'>('Sign in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()
  const isSignIn = mode === 'Sign in'

  const toggleSignInMode = () => {
    setMode(isSignIn ? 'Sign up' : 'Sign in')
  }

  const handleSubmit = () => {
    if (!!email && !!password) {
      isSignIn
        ? auth.setAuthPersistence(() =>
            auth.signIn(email, password, () => console.log('Successfully signed in'))
          )
        : auth.setAuthPersistence(() =>
            auth.signUp(email, password, () => console.log('Successfully signed up'))
          )
    }
  }

  return (
    <UnauthedRoute title="Plant Pal">
      <div className="sign-in__fields">
        <Typography>{mode}</Typography>
        <TextField
          label="Email address"
          type="email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          required
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <Button onClick={handleSubmit}>{mode}</Button>
        <Typography variant="body2" color="textSecondary">
          {isSignIn ? "Don't have an account? " : 'Have an account? '}
          <Link onClick={() => toggleSignInMode()}>{isSignIn ? 'Sign up' : 'Sign in'}</Link>.
        </Typography>
      </div>
    </UnauthedRoute>
  )
}

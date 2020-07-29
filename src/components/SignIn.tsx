import React, { ReactElement, useState } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import { useSnackbar } from 'notistack'
import * as yup from 'yup'
import { getAuth } from '../firebase'
import { Field, SignInFormValues, SignUpFormValues } from '../models'
import { UnauthedRoute } from './UnauthedRoute'

const signInFields: Field[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email address',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
  },
]

const signUpFields: Field[] = [
  ...signInFields,
  {
    name: 'passwordConfirm',
    type: 'password',
    label: 'Confirm password',
    required: true,
  },
]

const signInInitialValues: SignInFormValues = {
  email: '',
  password: '',
}

const signUpInitialValues: SignUpFormValues = {
  ...signInInitialValues,
  passwordConfirm: '',
}

const signInSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email address is required'),
  password: yup.string().required('Password is required'),
})

const signUpSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email address is required'),
  password: yup.string().min(8, 'Must be at least 8 characters').required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Must confirm password'),
})

export const SignIn = (props: RouteComponentProps): ReactElement => {
  const [mode, setMode] = useState<'Sign in' | 'Sign up'>('Sign in')
  const auth = getAuth()
  const { enqueueSnackbar } = useSnackbar()
  const isSignIn = mode === 'Sign in'
  const fields = isSignIn ? signInFields : signUpFields

  const toggleSignInMode = () => {
    setMode(isSignIn ? 'Sign up' : 'Sign in')
  }

  const handleSubmit = (values: SignUpFormValues) => {
    const { email, password } = values
    isSignIn
      ? auth.setAuthPersistence(() =>
          auth.signIn(email, password, () => {
            enqueueSnackbar('Successfully signed in', { variant: 'success' })
          })
        )
      : auth.signUp(email, password, () => {
          enqueueSnackbar('Account successfully created. Signing you in...', { variant: 'success' })
        })
  }

  return (
    <UnauthedRoute title="Plant Pal">
      <div className="sign-in__fields">
        <Typography>{mode}</Typography>
        <Formik
          initialValues={signUpInitialValues}
          validationSchema={isSignIn ? signInSchema : signUpSchema}
          onSubmit={(
            values: SignUpFormValues,
            { setSubmitting }: FormikHelpers<SignUpFormValues>
          ) => {
            handleSubmit(values)
            setSubmitting(true)
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
            resetForm,
            submitForm,
            touched,
            values,
          }: FormikProps<SignInFormValues>) => (
            <>
              {fields.map((field: Field) => {
                const { name, type, label, required } = field
                return (
                  <TextField
                    key={name}
                    name={name}
                    type={type}
                    label={label}
                    required={required}
                    value={values[name]}
                    error={!!errors[name] && !!touched[name]}
                    helperText={!!errors[name] && !!touched[name] && errors[name]}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                )
              })}
              <Button type="submit" disabled={isSubmitting} onClick={() => submitForm()}>
                {mode}
              </Button>
              <Typography variant="body2" color="textSecondary">
                {isSignIn ? "Don't have an account? " : 'Have an account? '}
                <Link
                  onClick={() => {
                    toggleSignInMode()
                    resetForm()
                  }}
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </Link>
                .
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Link
                  onClick={() => navigate('/reset-password')}
                >
                  Forgot password?
                </Link>
              </Typography>
            </>
          )}
        </Formik>
      </div>
    </UnauthedRoute>
  )
}

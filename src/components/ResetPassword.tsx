import React from 'react'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { RouteComponentProps, navigate } from '@reach/router'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import { useSnackbar } from 'notistack'
import * as yup from 'yup'
import { getAuth } from '../firebase'
import { ResetPasswordFormValues } from '../models'
import { UnauthedRoute } from './UnauthedRoute'

const initialValues: ResetPasswordFormValues = {
  email: '',
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email address cannot be blank'),
})

export const ResetPassword = (props: RouteComponentProps) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = (
    values: ResetPasswordFormValues,
    setSubmitting: (submitting: boolean) => void
  ): void => {
    const auth = getAuth()
    const { email } = values
    auth.resetPassword(email, () => {
      enqueueSnackbar(`Password reset link sent to ${email}.`, { variant: 'success' })
      setSubmitting(false)
    })
  }

  return (
    <UnauthedRoute title="Reset password">
      <Typography>
        Forgot your password? Enter your email below and
        <br />
        we'll send you an email with a link to reset your password.
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(
          values: ResetPasswordFormValues,
          { setSubmitting }: FormikHelpers<ResetPasswordFormValues>
        ) => {
          handleSubmit(values, setSubmitting)
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
        }: FormikProps<ResetPasswordFormValues>) => (
          <>
            <TextField
              name="email"
              value={values.email}
              label="Email address"
              error={!!errors.email && !!touched.email}
              helperText={!!errors.email && !!touched.email && errors.email}
              onBlur={handleBlur}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button disabled={isSubmitting} onClick={() => submitForm()}>
              Send password reset email
            </Button>
            <Typography variant="body2" color="textSecondary">
              <Link
                onClick={() => {
                  navigate('/')
                  resetForm()
                }}
              >
                Go back
              </Link>
            </Typography>
          </>
        )}
      </Formik>
    </UnauthedRoute>
  )
}

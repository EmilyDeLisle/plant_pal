import React from 'react'
import Typography from '@material-ui/core/Typography'
import { RouteComponentProps } from '@reach/router'
import { UnauthedRoute } from './UnauthedRoute'

export const NotFound = (props: RouteComponentProps) => {
  return (
    <UnauthedRoute title='Page Not Found'>
      <Typography>Redirecting...</Typography>
    </UnauthedRoute>
  )
}

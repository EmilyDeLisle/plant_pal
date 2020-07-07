import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { RouteComponentProps, navigate } from '@reach/router'
import { UnauthedRoute } from './UnauthedRoute'

export const NotFound = (props: RouteComponentProps) => {
  return (
    <UnauthedRoute title='Not Found'>
      <Button>Go back</Button>
    </UnauthedRoute>
  )
}

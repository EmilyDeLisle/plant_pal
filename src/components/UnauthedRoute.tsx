import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

interface UnauthedRouteProps {
  children: ReactElement | ReactElement[] | null
  title: string
  
}

export const UnauthedRoute = ({ children, title }: UnauthedRouteProps) => {
  return (
    <div className='unauthed-route__container'>
      <Card>
        <Typography variant='h3'>{title}</Typography>
        {children}
      </Card>
    </div>
  )
}

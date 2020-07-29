import React, { ReactElement } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontFamily: 'Lobster, cursive'
    }})
)

interface UnauthedRouteProps {
  children: ReactElement | ReactElement[] | null
  title: string
}

export const UnauthedRoute = ({ children, title }: UnauthedRouteProps) => {
  const classes = useStyles()
  return (
    <div className="unauthed-route__container">
      <Card>
        <div className="unauthed-route__contents">
          <Typography className={classes.title} variant="h3" gutterBottom>{title}</Typography>
          {children}
        </div>
      </Card>
    </div>
  )
}

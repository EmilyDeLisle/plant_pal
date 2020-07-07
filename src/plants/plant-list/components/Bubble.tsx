import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontFamily: 'Roboto Mono',
      fontSize: '14pt'
    },
  })
)

interface BubbleProps {
  color?:
    | 'inherit'
    | 'initial'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error'
    | undefined
  text: string
}

// code taken from https://www.ilikepixels.co.uk/bubbler/
export const Bubble = ({ color, text }: BubbleProps) => {
  const classes = useStyles()
  return (
    <div className="bubble">
      <Typography className={classes.text} variant="h6" color={color} align="center">
        {text}
      </Typography>
    </div>
  )
}

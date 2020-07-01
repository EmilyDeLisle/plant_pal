import React from 'react'
import { inject, observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import UserIcon from '@material-ui/icons/AccountCircle'
import { plantStore } from '../../injectables'
import { getDatabase, getAuth } from '../../firebase'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userIcon: {
      color: theme.palette.primary.contrastText,
    },
  })
)

export const TopNavNar = inject('plantStore')(
  observer(() => {
    const { clearStore } = plantStore
    const db = getDatabase()
    const auth = getAuth()
    const classes = useStyles()
    return (
      <AppBar position="static">
        <div className="top-nav-bar__contents">
          <Typography variant="h4">PLAPP</Typography>
          <IconButton
            className={classes.userIcon}
            size="medium"
            edge="end"
            onClick={() => {
              auth.signOut(() => {
                console.log('Signing out')
              })
            }}
          >
            <UserIcon />
          </IconButton>
        </div>
      </AppBar>
    )
  })
)

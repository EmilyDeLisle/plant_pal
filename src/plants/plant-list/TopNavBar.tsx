import React from 'react'
import { navigate } from '@reach/router'
import { inject, observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Hidden from '@material-ui/core/Hidden'
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
    const {
      sortingMode,
      sortingDirection,
      setSortingMode,
      setSortingDirection,
      clearStore,
    } = plantStore
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
              const user = auth.getCurrentUser()
              !!user
                ? auth.signOut(() => {
                    db.unsubscribe && db.unsubscribe()
                    clearStore()
                    navigate('/')
                    console.log('Signing out')
                  })
                : navigate('/')
            }}
          >
            <UserIcon />
          </IconButton>
        </div>
      </AppBar>
    )
  })
)

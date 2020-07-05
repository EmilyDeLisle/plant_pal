import React, { useState } from 'react'
import { observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import UserIcon from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import { getAuth } from '../../firebase'
import { plantStore } from '../../injectables'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userIcon: {
      color: theme.palette.primary.contrastText,
    },
    userPanel: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  })
)

export const TopNavNar = observer(() => {
  const auth = getAuth()
  const classes = useStyles()
  const { plantCount } = plantStore
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = (): void => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <div className="top-nav-bar__contents">
        <Typography variant="h5">PLAPP</Typography>
        <IconButton className={classes.userIcon} size="medium" edge="end" onClick={handleClickMenu}>
          <UserIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          MenuListProps={{ disablePadding: true }}
        >
          <div className={`${classes.userPanel} top-nav-bar__user-panel`}>
            <Typography variant="h6" align="right">
              {auth.getCurrentUser()?.email}
            </Typography>
            <Typography variant="h1" align="right">
              {plantCount}
            </Typography>
            <Typography variant="h6" align="right">
              plants
            </Typography>
            <div className='top-nav-bar__user-panel-button'>
              <Button
                color="inherit"
                onClick={() => {
                  auth.signOut(() => {
                    console.log('Signing out')
                  })
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </Menu>
      </div>
    </AppBar>
  )
})

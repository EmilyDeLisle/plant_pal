import React from 'react'
import { navigate } from '@reach/router'
import { inject, observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { SortingButton } from './SortingButton'
import { plantStore } from '../../injectables'
import { SortingMode } from '../../models'
import { getDatabase, getAuth } from '../../firebase'

export const TopNavNar = inject('plantStore')(
  observer(() => {
    const { sortingMode, sortingDirection, setSortingMode, setSortingDirection } = plantStore
    const db = getDatabase()
    const auth = getAuth()
    return (
      <AppBar position="static">
        <div className="top-nav-bar__contents">
          <div className="top-nav-bar__section top-nav-bar__top">
            <Typography variant="h6">PLAPP</Typography>
            <Button
              onClick={() => {
                const user = auth.getCurrentUser()
                !!user ? auth.signOut(() => { 
                  db.unsubscribe && db.unsubscribe()
                  navigate('/')
                  console.log('Signing out')
                }) : navigate('/')
              }}
            >
              Sign out
            </Button>
          </div>
          <div className="top-nav-bar__section top-nav-bar__bottom">
            <Typography color="textPrimary">Sort by: </Typography>
            <div className="top-nav-bar__buttons">
              <SortingButton
                selected={sortingMode === SortingMode.NAME}
                mode={SortingMode.NAME}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
              <SortingButton
                selected={sortingMode === SortingMode.WATER}
                mode={SortingMode.WATER}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
              <SortingButton
                selected={sortingMode === SortingMode.FERTILIZE}
                mode={SortingMode.FERTILIZE}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
              <SortingButton
                selected={sortingMode === SortingMode.INTERVAL}
                mode={SortingMode.INTERVAL}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
            </div>
          </div>
        </div>
      </AppBar>
    )
  })
)

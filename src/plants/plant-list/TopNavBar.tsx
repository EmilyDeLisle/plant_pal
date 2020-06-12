import React from 'react'
import { inject, observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import { SortingButton } from './SortingButton'
import { plantStore } from '../../injectables'
import { SortingMode } from '../../models'

export const TopNavNar = inject('plantStore')(
  observer(() => {
    const { sortingMode, sortingDirection, setSortingMode, setSortingDirection } = plantStore

    return (
      <AppBar position="static">
        <div className="top-nav-bar__contents">
          <div className="top-nav-bar__section top-nav-bar__top">
            <Typography variant="h6">PLAPP</Typography>
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

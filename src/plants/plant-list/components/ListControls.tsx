import React from 'react'
import { inject, observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { SortingButton, SplitSortingButton } from './SortingButton'
import { InspectorMode, SortingMode } from '../../../models'
import MonsteraIcon from '../../../assets/MonsteraIcon'
import { plantStore } from '../../../injectables'

export const ListControls = inject('plantStore')(
  observer(() => {
    const {
      setInspectorMode,
      setSortingDirection,
      setSortingMode,
      sortingDirection,
      sortingMode,
    } = plantStore
    const theme = useTheme()
    const isNarrow = useMediaQuery(theme.breakpoints.down('md'))
    return (
      <div className="list-controls__container">
        <Hidden xsDown>
          <Button
            color="primary"
            variant="contained"
            startIcon={<MonsteraIcon />}
            onClick={() => setInspectorMode(InspectorMode.ADD)}
          >
            Add Plant
          </Button>
        </Hidden>
        <div className="list-controls__sorting-buttons">
          <Typography color="textPrimary">Sort by: </Typography>
          {isNarrow ? (
            <div className="list-controls__split-sorting-button">
              <SplitSortingButton
                mode={sortingMode}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
            </div>
          ) : (
            Object.values(SortingMode).map((mode) => (
              <SortingButton
                key={mode}
                selected={sortingMode === mode}
                mode={mode}
                direction={sortingDirection}
                handleChangeMode={setSortingMode}
                handleChangeDirection={setSortingDirection}
              />
            ))
          )}
        </div>
      </div>
    )
  })
)

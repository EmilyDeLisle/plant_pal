import React from 'react'
import { inject, observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { SortingButton } from './SortingButton'
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
    return (
      <div className="list-controls__container">
        <Button
          color="primary"
          variant="contained"
          startIcon={<MonsteraIcon />}
          onClick={() => setInspectorMode(InspectorMode.ADD)}
        >
          Add Plant
        </Button>
        <div className="list-controls__sorting-buttons">
          <Typography>Sort by: </Typography>
          {Object.values(SortingMode).map((mode) => (
            <SortingButton
              key={mode}
              selected={sortingMode === mode}
              mode={mode}
              direction={sortingDirection}
              handleChangeMode={setSortingMode}
              handleChangeDirection={setSortingDirection}
            />
          ))}
        </div>
      </div>
    )
  })
)

import React, { ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { navigate, RouteComponentProps } from '@reach/router'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
// import { plantStore } from '../injectables'
// import { PlantDialogMode } from '../models'
// import { getAuth } from '../firebase'
import { SortingButton } from './SortingButton'
import { SortingMode } from '../../../models'
import MonsteraIcon from '../../../assets/MonsteraIcon'
import { plantStore } from '../../../injectables'

export const ListControls = inject('plantStore')(
  observer(() => {
    const { setSortingDirection, setSortingMode, sortingDirection, sortingMode } = plantStore
    return (
      <div className="list-controls__container">
        <Button
          color="primary"
          variant="contained"
          startIcon={<MonsteraIcon />}
          // onClick={() => handleOpenAddDialog()}
        >
          Add Plant
        </Button>
        <div className="list-controls__sorting-buttons">
          <Typography>Sort by: </Typography>
          {Object.values(SortingMode).map((mode) => (
            <SortingButton
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

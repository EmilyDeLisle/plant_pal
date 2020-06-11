import React, { ReactElement, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { PlantList, TopNavNar, PlantDialog } from './plant-list'
import { plantStore } from '../injectables'


export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const [dialogOpen, setDialogOpen] = useState(false)
      const { plantsToWaterList, plantsRemainingList, selectedPlant, modifyPlant } = plantStore
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <TopNavNar />
          <div className="plants__container">
            {plantsToWaterList.length > 0 && (
              <PlantList plants={plantsToWaterList} handleOpen={() => setDialogOpen(true)} />
            )}
            {plantsRemainingList.length > 0 && (
              <PlantList plants={plantsRemainingList} handleOpen={() => setDialogOpen(true)} />
            )}
          </div>
          {!!selectedPlant && (
            <PlantDialog
              plant={selectedPlant}
              open={dialogOpen}
              handleClose={() => setDialogOpen(false)}
              modifyPlant={modifyPlant}
            />
          )}
        </MuiPickersUtilsProvider>
      )
    }
  )
)

import React, { ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { navigate, RouteComponentProps } from '@reach/router'
import Typography from '@material-ui/core/Typography'
import { InspectorPanel, ListControls, PlantList, TopNavNar, PlantDialog } from './plant-list'
import { plantStore } from '../injectables'
import { PlantDialogMode } from '../models'
import { getAuth } from '../firebase'

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const auth = getAuth()
      const [dialogOpen, setDialogOpen] = useState(false)
      const {
        plantsToWaterList,
        plantsRemainingList,
        selectedPlant,
        dialogMode,
        setDialogMode,
      } = plantStore

      useEffect(() => {
        if (!auth.getCurrentUser()) {
          console.log('Not signed in, navigating back to sign in page')
          navigate('/')
        }
      }, [])

      const handleOpenAddDialog = () => {
        setDialogMode(PlantDialogMode.ADD)
        setDialogOpen(true)
      }

      const handleOpenViewDialog = () => {
        setDialogMode(PlantDialogMode.VIEW)
        setDialogOpen(true)
      }

      return (
        <div className="plants">
          <TopNavNar />
          <div className="plants__container">
            <div className="plants__lists-container">
              <ListControls/>
              <div className="plants__lists">
                {plantsToWaterList.length > 0 && (
                  <div className="plants__attention-list">
                    <Typography variant="h5" color="primary">
                      Plants needing attention
                    </Typography>
                    <PlantList
                      plants={plantsToWaterList}
                      handleOpen={() => handleOpenViewDialog()}
                    />
                  </div>
                )}
                {plantsRemainingList.length > 0 && (
                  <>
                    <Typography variant="h4" color="primary">
                      Plants
                    </Typography>
                    <PlantList
                      plants={plantsRemainingList}
                      handleOpen={() => handleOpenViewDialog()}
                    />
                  </>
                )}
              </div>
            </div>
            <InspectorPanel />
          </div>
          <PlantDialog
            plant={selectedPlant}
            open={dialogOpen}
            dialogMode={dialogMode}
            handleClose={() => setDialogOpen(false)}
          />
        </div>
      )
    }
  )
)

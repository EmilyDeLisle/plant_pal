import React, { ReactElement, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { PlantList, TopNavNar, PlantDialog } from './plant-list'
import { plantStore } from '../injectables'
import { PlantDialogMode } from '../models'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(8),
      right: theme.spacing(8),
    },
  })
)

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const classes = useStyles()
      const [dialogOpen, setDialogOpen] = useState(false)
      const {
        plantsToWaterList,
        plantsRemainingList,
        selectedPlant,
        dialogMode,
        setDialogMode,
      } = plantStore

      const handleOpenAddDialog = () => {
        setDialogMode(PlantDialogMode.ADD)
        setDialogOpen(true)
      }

      const handleOpenViewDialog = () => {
        setDialogMode(PlantDialogMode.VIEW)
        setDialogOpen(true)
      }

      return (
        <>
          <TopNavNar />
          <div className="plants__container">
            {plantsToWaterList.length > 0 && (
              <PlantList plants={plantsToWaterList} handleOpen={() => handleOpenViewDialog()} />
            )}
            {plantsRemainingList.length > 0 && (
              <PlantList plants={plantsRemainingList} handleOpen={() => handleOpenViewDialog()} />
            )}
            <div className="plants__fab">
              <Tooltip title="Add new plant" placement="left">
                <Fab className={classes.fab} color="primary" onClick={() => handleOpenAddDialog()}>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </div>
          </div>
          <PlantDialog
            plant={selectedPlant}
            open={dialogOpen}
            dialogMode={dialogMode}
            handleClose={() => setDialogOpen(false)}
          />
        </>
      )
    }
  )
)

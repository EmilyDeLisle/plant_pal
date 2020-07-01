import React, { ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { navigate, RouteComponentProps } from '@reach/router'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { PlantList, TopNavNar, PlantDialog } from './plant-list'
import { plantStore } from '../injectables'
import { PlantDialogMode } from '../models'
import { getAuth } from '../firebase'
import MonsteraIcon from '../assets/MonsteraIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    attentionList: {
      borderColor: theme.palette.text.primary
    }
  })
)

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const classes = useStyles()
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
            <div className="plants__lists">
              {plantsToWaterList.length > 0 && (
                <div className={`${classes.attentionList} plants__attention-list`}>
                  <Typography variant="h5" color='primary'>Plants needing attention</Typography>
                  <PlantList plants={plantsToWaterList} handleOpen={() => handleOpenViewDialog()} />
                </div>
              )}
              {plantsRemainingList.length > 0 && (
                <>
                  <Typography variant="h4" color='primary'>Plants</Typography>
                  <PlantList
                    plants={plantsRemainingList}
                    handleOpen={() => handleOpenViewDialog()}
                  />
                </>
              )}
            </div>

            <div className="plants__fab">
              <Tooltip title="Add new plant" placement="left">
                <Fab
                  className={classes.fab}
                  size="large"
                  color="primary"
                  onClick={() => handleOpenAddDialog()}
                >
                  <MonsteraIcon />
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
        </div>
      )
    }
  )
)

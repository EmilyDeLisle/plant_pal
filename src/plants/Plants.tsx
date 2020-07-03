import React, { ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import Fab from '@material-ui/core/Fab'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { InspectorPanel, ListControls, PlantList, TopNavNar } from './plant-list'
import { plantStore } from '../injectables'
import { InspectorMode } from '../models'
import MonsteraIcon from '../assets/MonsteraIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    listsContainer: {
      [theme.breakpoints.up('md')]: {
        padding: '2em 2em 0 2em',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0.5em 0.5em 0 0.5em',
      },
    },
  })
)

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const theme = useTheme()
      const { plantsToWaterList, plantsRemainingList, inspectorMode, setInspectorMode } = plantStore
      const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
      const classes = useStyles()

      return (
        <div className="plants">
          <TopNavNar />
          <div className="plants__container">
            {isMobile && inspectorMode !== InspectorMode.DEFAULT ? (
              <InspectorPanel />
            ) : (
              <>
                <div className={classes.listsContainer}>
                  <ListControls />
                  <div className="plants__lists">
                    {plantsToWaterList.length > 0 && (
                      <div className="plants__attention-list">
                        <Typography color="textPrimary" variant="h5">
                          Plants needing attention
                        </Typography>
                        <PlantList plants={plantsToWaterList} />
                      </div>
                    )}
                    {plantsRemainingList.length > 0 && (
                      <>
                        <Typography color="textPrimary" variant="h4">
                          Plants
                        </Typography>
                        <PlantList plants={plantsRemainingList} />
                      </>
                    )}
                  </div>
                </div>
                <Hidden smDown>
                  <InspectorPanel />
                </Hidden>
                {inspectorMode === InspectorMode.DEFAULT && (
                  <Hidden mdUp>
                    <Fab
                      className={classes.fab}
                      onClick={() => setInspectorMode(InspectorMode.ADD)}
                    >
                      <MonsteraIcon />
                    </Fab>
                  </Hidden>
                )}
              </>
            )}
          </div>
        </div>
      )
    }
  )
)

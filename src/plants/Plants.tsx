import React, { ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import Fab from '@material-ui/core/Fab'
import Hidden from '@material-ui/core/Hidden'
import Tooltip from '@material-ui/core/Tooltip'
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
      bottom: theme.spacing(6),
      right: theme.spacing(6),
    },
    listsContainer: {
      flexGrow: 1,
      [theme.breakpoints.up('lg')]: {
        padding: '2em 2em 0 2em',
      },
      [theme.breakpoints.down('md')]: {
        padding: '0.5em 0.5em 0 0.5em',
        width: 'calc(100% - 1em)',
      },
    },
  })
)

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const theme = useTheme()
      const {
        plantsNeedingAttentionList,
        plantsRemainingList,
        inspectorMode,
        setInspectorMode,
      } = plantStore
      const plantsNeedingAttentionCount = plantsNeedingAttentionList.length
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
                    {!!plantsNeedingAttentionCount && (
                      <div className="plants__attention-list">
                        <Typography color="textPrimary" variant="h5">
                          {`${plantsNeedingAttentionCount} plant${
                            plantsNeedingAttentionCount !== 1 ? 's' : ''
                          } needing attention`}
                        </Typography>
                        <PlantList plants={plantsNeedingAttentionList} />
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
                    <div className="plants__list-spacer"></div>
                  </div>
                </div>
                <Hidden smDown>
                  <InspectorPanel />
                </Hidden>
                {inspectorMode === InspectorMode.DEFAULT && (
                  <Hidden smUp>
                    <Tooltip title="Add new plant" placement="left">
                      <Fab
                        className={classes.fab}
                        color="primary"
                        onClick={() => setInspectorMode(InspectorMode.ADD)}
                      >
                        <MonsteraIcon />
                      </Fab>
                    </Tooltip>
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

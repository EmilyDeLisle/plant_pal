import React, { ReactElement, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import Hidden from '@material-ui/core/Hidden'
import Slide from '@material-ui/core/Slide'
import Tooltip from '@material-ui/core/Tooltip'
import { TransitionProps } from '@material-ui/core/transitions'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useSnackbar } from 'notistack'
import { TopNavNar } from './TopNavBar'
import { ListControls } from './ListControls'
import { InspectorPanel } from './InspectorPanel'
import { PlantList } from './PlantList'
import { getDatabase } from '../firebase'
import { plantStore } from '../injectables'
import { InspectorMode, Plant, PlantEvent } from '../models'
import { Bubble } from './Bubble'
import MonsteraPlusIcon from '../assets/MonsteraPlusIcon'

// Designed by macrovector / Freepik - freepik.com
import MonsteraImg from '../assets/monstera.png'

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const Plants = inject('plantStore')(
  observer(
    (props: RouteComponentProps): ReactElement => {
      const {
        plantsNeedingAttentionList,
        plantsRemainingList,
        plantsLoaded,
        plantCount,
        setInspectorMode,
      } = plantStore
      const [inspectorOpen, setInspectorOpen] = useState(false)
      const plantsNeedingAttentionCount = plantsNeedingAttentionList.length
      const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
      const classes = useStyles()
      const { enqueueSnackbar } = useSnackbar()

      const bubbleMessage = plantsLoaded
        ? !!plantCount
          ? 'Click on a plant!'
          : 'Click on "Add Plant" to start tracking plants'
        : 'Loading plants...'

      const handleInspectorOpen = (mode: InspectorMode) => {
        setInspectorMode(mode)
        setInspectorOpen(true)
      }

      const handleInspectorClose = () => {
        setInspectorOpen(false)
      }

      const handleModifyPlant = (
        event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
        plant: Plant,
        plantEvent: PlantEvent
      ): void => {
        const db = getDatabase()
        const {
          eventType,
          date,
          initialMessage,
          successMessage,
          duplicateMessage,
          errorMessage,
        } = plantEvent
        event.stopPropagation()
        !!initialMessage && enqueueSnackbar(initialMessage)
        db.modifyPlant(
          plant,
          eventType,
          date,
          // onSuccess
          () => {
            !!successMessage && enqueueSnackbar(successMessage, { variant: 'success' })
          },
          // onError
          (error) => {
            !!errorMessage && enqueueSnackbar(errorMessage, { variant: 'error' })
            console.log(error)
          },
          // handleDuplicateMessage
          () => {
            !!duplicateMessage && enqueueSnackbar(duplicateMessage, { variant: 'warning' })
          }
        )
      }

      return (
        <>
          <div className="plants">
            <div className="plants__bg-layer">
              <TopNavNar />
              <div className="plants__container">
                <div className={classes.listsContainer}>
                  <ListControls handleInspectorOpen={handleInspectorOpen} />
                  <div className="plants__lists">
                    {!!plantsNeedingAttentionCount && (
                      <div className="plants__attention-list">
                        <Typography color="textPrimary" variant="h5">
                          {`${plantsNeedingAttentionCount} plant${
                            plantsNeedingAttentionCount !== 1 ? 's' : ''
                          } need attention`}
                        </Typography>
                        <PlantList
                          plants={plantsNeedingAttentionList}
                          handleModifyPlant={handleModifyPlant}
                          handleInspectorOpen={handleInspectorOpen}
                        />
                      </div>
                    )}
                    <Typography color="textPrimary" variant="h4">
                      Plants
                    </Typography>
                    {plantsLoaded ? (
                      plantsRemainingList.length > 0 ? (
                        <PlantList
                          plants={plantsRemainingList}
                          handleModifyPlant={handleModifyPlant}
                          handleInspectorOpen={handleInspectorOpen}
                        />
                      ) : (
                        <Typography color="textPrimary" align="center">
                          <em>{plantCount === 0 ? 'No plants yet' : 'No plants'}</em>
                        </Typography>
                      )
                    ) : (
                      <div className="plants__list-progress">
                        <CircularProgress color="primary" />
                      </div>
                    )}
                    <div className="plants__list-spacer"></div>
                  </div>
                </div>
                <Hidden smDown>
                  <div className="plants__inspector-panel-placeholder">
                    <div className="plants__inspector-panel-bubble">
                      <Bubble text={bubbleMessage} color="textPrimary" />
                    </div>
                    <img
                      className="plants__inspector-panel-img"
                      src={MonsteraImg}
                      alt={bubbleMessage}
                    />
                  </div>
                  <Drawer variant="persistent" anchor="right" open={!isMobile && inspectorOpen}>
                    <InspectorPanel
                      handleModifyPlant={handleModifyPlant}
                      handleInspectorClose={handleInspectorClose}
                    />
                  </Drawer>
                </Hidden>
                {isMobile && !inspectorOpen && (
                  <Tooltip title="Add new plant" placement="left">
                    <Fab
                      className={classes.fab}
                      color="primary"
                      onClick={() => handleInspectorOpen(InspectorMode.ADD)}
                    >
                      <MonsteraPlusIcon />
                    </Fab>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          <Dialog fullScreen open={isMobile && inspectorOpen} TransitionComponent={Transition}>
            <InspectorPanel
              handleModifyPlant={handleModifyPlant}
              handleInspectorClose={handleInspectorClose}
            />
          </Dialog>
        </>
      )
    }
  )
)

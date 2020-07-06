import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { InspectorMode } from '../../../models'
import { Bubble } from './Bubble'
import { InspectorPanelContentAdd, InspectorPanelContentView } from './InspectorPanelContent'
import { plantStore } from '../../../injectables'

// Designed by macrovector / Freepik - freepik.com
import MonsteraImg from '../../../assets/monstera.png'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inspectorPanel: {
      maxWidth: '540px',
      minWidth: '540px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
  })
)

export const InspectorPanel = observer(() => {
  const { selectedPlant, inspectorMode, plantsLoaded, plantCount, setInspectorMode } = plantStore
  const classes = useStyles()
  const message = plantsLoaded
    ? !!plantCount
      ? 'Click on a plant!'
      : 'Click on "Add Plant" to start tracking plants'
    : 'Loading plants...'

  return inspectorMode === InspectorMode.DEFAULT ? (
    <div className={`${classes.inspectorPanel} inspector-panel__default`}>
      <div className="inspector-panel__bubble">
        <Bubble text={message} color="textPrimary" />
      </div>
      <img className="inspector-panel__img" src={MonsteraImg}></img>
    </div>
  ) : (
    <div className={`${classes.inspectorPanel} inspector-panel__container`}>
      {inspectorMode === InspectorMode.VIEW && !!selectedPlant ? (
        <InspectorPanelContentView
          plant={selectedPlant}
          handleClose={() => setInspectorMode(InspectorMode.DEFAULT)}
        />
      ) : (
        <InspectorPanelContentAdd handleClose={() => setInspectorMode(InspectorMode.DEFAULT)} />
      )}
    </div>
  )
})

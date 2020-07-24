import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { InspectorMode, Plant, PlantEvent } from '../models'
import { Bubble } from './Bubble'
import { InspectorPanelContentAdd, InspectorPanelContentView } from './InspectorPanelContent'
import { plantStore } from '../injectables'

// Designed by macrovector / Freepik - freepik.com
import MonsteraImg from '../assets/monstera.png'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inspectorPanel: {
      maxWidth: '540px',
      minWidth: '540px',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        minWidth: 0,
      },
    },
  })
)

interface InspectorPanelProps {
  handleModifyPlant: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
    plant: Plant,
    plantEvent: PlantEvent
  ) => void
  handleInspectorClose: () => void
}

export const InspectorPanel = observer(
  ({ handleModifyPlant, handleInspectorClose }: InspectorPanelProps) => {
    const { selectedPlant, inspectorMode, setInspectorMode } = plantStore
    const classes = useStyles()

    return (
      <div className={`${classes.inspectorPanel} inspector-panel__container`}>
        {inspectorMode === InspectorMode.VIEW && !!selectedPlant ? (
          <InspectorPanelContentView
            plant={selectedPlant}
            handleClose={handleInspectorClose}
            handleModifyPlant={handleModifyPlant}
          />
        ) : (
          <InspectorPanelContentAdd handleClose={handleInspectorClose} />
        )}
      </div>
    )
  }
)

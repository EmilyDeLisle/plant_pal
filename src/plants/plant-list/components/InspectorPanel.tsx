import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { observer } from 'mobx-react'
import { InspectorMode } from '../../../models'
import { PlantDialogContentAdd, PlantDialogContentView } from './PlantDialogContent'
import { plantStore } from '../../../injectables'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      color: theme.palette.primary.contrastText,
    },
    titleText: {
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
    },
  })
)

export const InspectorPanel = observer(() => {
  const { selectedPlant, inspectorMode, setInspectorMode } = plantStore

  return inspectorMode === InspectorMode.DEFAULT ? (
    <div className="inspector-panel__default"></div>
  ) : (
    <div className='inspector-panel__container'>
      {inspectorMode === InspectorMode.VIEW && !!selectedPlant ? (
        <PlantDialogContentView
          plant={selectedPlant}
          handleClose={() => setInspectorMode(InspectorMode.DEFAULT)}
        />
      ) : (
        <PlantDialogContentAdd handleClose={() => setInspectorMode(InspectorMode.DEFAULT)} />
      )}
    </div>
  )
})

import React from 'react'
import { observer } from 'mobx-react'
import { InspectorMode } from '../../../models'
import { InspectorPanelContentAdd, InspectorPanelContentView } from './InspectorPanelContent'
import { plantStore } from '../../../injectables'

export const InspectorPanel = observer(() => {
  const { selectedPlant, inspectorMode, setInspectorMode } = plantStore

  return inspectorMode === InspectorMode.DEFAULT ? (
    <div className="inspector-panel__default"></div>
  ) : (
    <div className='inspector-panel__container'>
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

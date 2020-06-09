import React, { ReactElement } from 'react'
import { Plant } from '../../models'
import { ListRow } from './components'

export interface PlantListProps {
  plants: Plant[]
  handleOpen: () => void
}

export const PlantList = ({ plants, handleOpen }: PlantListProps): ReactElement => {
  return (
    <>
      <div className="plant-list__row-container">
        {plants.map((plant: Plant) => (
          <ListRow key={plant.id} plant={plant} handleOpen={handleOpen}/>
        ))}
      </div>
    </>
  )
}

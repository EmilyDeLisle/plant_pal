import React, { ReactElement } from 'react';
import { Plant } from '../../models'


export interface PlantListProps {
    plants: Plant[]
}

export const PlantList = ({ plants }: PlantListProps): ReactElement => {
  return (
    <div>
      <p>Plant list!</p>
      {plants.map((plant: Plant) => (
        <div>
          <p>{plant.id}</p>
          <p>{plant.name}</p>
        </div>
      )
      )}
    </div>
  )
}
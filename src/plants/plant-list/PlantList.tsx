import React, { ReactElement } from 'react'
import { Plant } from '../../models'
import { ListRow } from './components'

export interface PlantListProps {
  plants: Plant[]
}

export const PlantList = ({ plants }: PlantListProps): ReactElement => {
  return (
    <>
        {plants.map((plant: Plant) => {
          const { id, name } = plant
          return <ListRow key={id ? id : name} plant={plant} />
        })}
    </>
  )
}

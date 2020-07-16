import React, { ReactElement } from 'react'
import { Plant, PlantEvent } from '../../models'
import { ListRow } from '../../components'

export interface PlantListProps {
  plants: Plant[]
  handleModifyPlant: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
    plant: Plant,
    plantEvent: PlantEvent
  ) => void
}

export const PlantList = ({ plants, handleModifyPlant }: PlantListProps): ReactElement => {
  return (
    <>
      {plants.map((plant: Plant) => {
        const { id, name } = plant
        return <ListRow key={id ? id : name} plant={plant} handleModifyPlant={handleModifyPlant} />
      })}
    </>
  )
}

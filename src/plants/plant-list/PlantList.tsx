import React, { ReactElement } from 'react'
import Typography from '@material-ui/core/Typography'
import { Plant } from '../../models'
import { ListRow } from './components'

export interface PlantListProps {
  plants: Plant[]
}

export const PlantList = ({ plants }: PlantListProps): ReactElement => {
  return (
    <div>
      <Typography variant='h4'>Plants</Typography>
      {plants.map((plant: Plant) => (
        <ListRow key={plant.id} plant={plant} />
      ))}
    </div>
  )
}

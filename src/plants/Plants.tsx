import React, { ReactElement } from 'react'
import { PlantList } from './plant-list'
import { Plant } from '../models'
import { RouteComponentProps } from '@reach/router'

const p: Plant = {
  id: '123',
  name: 'Planty Boi',
  lastWatered: undefined,
  lastFertilized: undefined,
  wateringDates: [],
  fertilizingDates: []
}

export const Plants = (props: RouteComponentProps): ReactElement => {
  return (
    <div>
      <PlantList plants={[p]}/>
    </div>
  )
}

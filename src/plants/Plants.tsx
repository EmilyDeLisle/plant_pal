import React, { ReactElement } from 'react'
import { RouteComponentProps } from '@reach/router'
import { PlantList } from './plant-list'
import { Plant } from '../models'
import { plantStore } from '../injectables'

const test_plants = {
  '123': {
    id: '123',
    name: 'Plant Fren',
    lastWatered: '2020-06-01T21:36:41Z',
    lastFertilized: '2020-06-01T21:36:41Z',
    wateringDates: ['2020-06-01T21:36:41Z', '2020-05-25T21:36:41Z'],
    fertilizingDates: ['2020-06-01T21:36:41Z'],
  },
  '124': {
    id: '124',
    name: 'Planty Boi',
    lastWatered: '2020-06-01T21:36:41Z',
    lastFertilized: '2020-06-01T21:36:41Z',
    wateringDates: ['2020-06-01T21:36:41Z', '2020-05-25T21:36:41Z'],
    fertilizingDates: ['2020-06-01T21:36:41Z'],
  },
  '125': {
    id: '125',
    name: 'Peeb',
    wateringDates: [],
    fertilizingDates: [],
  },
}

export const Plants = (props: RouteComponentProps): ReactElement => {
  plantStore.setPlants(test_plants)
  return (
    <div>
      <PlantList />
    </div>
  )
}

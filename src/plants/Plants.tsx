import React, { ReactElement } from 'react'
import { PlantList } from './plant-list'
import { Plant } from '../models'
import { RouteComponentProps } from '@reach/router'

const p = new Plant({
  id: '123',
  name: 'Plant Fren',
  lastWatered: '2020-06-01T21:36:41Z',
  lastFertilized: '2020-06-01T21:36:41Z',
  wateringDates: ['2020-06-01T21:36:41Z'],
  fertilizingDates: ['2020-06-01T21:36:41Z']
})

const test_plants = [
  new Plant({
    id: '123',
    name: 'Plant Fren',
    lastWatered: '2020-06-01T21:36:41Z',
    lastFertilized: '2020-06-01T21:36:41Z',
    wateringDates: ['2020-06-01T21:36:41Z', '2020-05-25T21:36:41Z'],
    fertilizingDates: ['2020-06-01T21:36:41Z']
  }),
  new Plant({
    id: '124',
    name: 'Planty Boi',
    lastWatered: '2020-06-01T21:36:41Z',
    lastFertilized: '2020-06-01T21:36:41Z',
    wateringDates: ['2020-06-01T21:36:41Z', '2020-05-25T21:36:41Z'],
    fertilizingDates: ['2020-06-01T21:36:41Z']
  }),
  new Plant({
    id: '125',
    name: 'Peeb',
    wateringDates: [],
    fertilizingDates: []
  }),
]

export const Plants = (props: RouteComponentProps): ReactElement => {
  test_plants.forEach(plant => console.log(plant.toString()))
  return (
    <div>
      <PlantList plants={test_plants}/>
    </div>
  )
}

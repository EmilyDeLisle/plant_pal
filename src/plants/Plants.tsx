import React, { ReactElement } from 'react'
import { RouteComponentProps } from '@reach/router'
import { PlantList } from './plant-list'
import { Plant } from '../models'
import { plantStore } from '../injectables'

const test_plants = {
  '123': new Plant(
    '123',
    'Plant Fren',
    ['2020-05-29T21:36:41Z', '2020-05-22T21:36:41Z', '2020-01-25T21:36:41Z'],
    ['2020-06-01T21:36:41Z'],
    '2020-06-05T21:36:41Z'
  ),
  '124': new Plant(
    '124',
    'Planty Boi',
    ['2020-06-01T21:36:41Z', '2020-05-29T21:36:41Z'],
    ['2020-06-01T21:36:41Z']
  ),
  '125': new Plant('125', 'Peeb', [], []),
}

export const Plants = (props: RouteComponentProps): ReactElement => {
  plantStore.setPlants(test_plants)
  return (
    <div className='plants__container'>
      <PlantList />
    </div>
  )
}

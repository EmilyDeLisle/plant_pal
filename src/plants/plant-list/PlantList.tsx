import React, { ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import { Plant, PlantMap } from '../../models'
import { PlantStoreProps, plantStore } from '../../injectables'
import { ListRow } from './components'

export interface PlantListProps {
  plants: PlantMap
}

export const PlantList = inject('plantStore')(
  observer(
    (): ReactElement => {
      const { plantList, modifyPlant, setPlants, plants } = plantStore
      const addTestPlant = () => {
        const index = String(Math.floor(Math.random() * 1000))
        let newPlantList: PlantMap = {}
        newPlantList[index] = { id: index, name: 'Test Plant' }
        const newPlants = {
          ...newPlantList,
          ...plants
        }
        console.log(newPlants)
        setPlants(newPlants)
      }

      return (
        <div>
          <Typography variant="h4">Plants</Typography>
          <button onClick={() => addTestPlant()}>Test Add Plant</button>
          {plantList.map((plant: Plant) => (
            <ListRow key={plant.id} plant={plant} handleModifyPlant={modifyPlant} />
          ))}
        </div>
      )
    }
  )
)

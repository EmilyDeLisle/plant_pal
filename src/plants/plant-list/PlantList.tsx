import React, { ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import { Plant, PlantMap, SortingMode, SortingDirection } from '../../models'
import { PlantStoreProps, plantStore } from '../../injectables'
import { ListRow } from './components'

export interface PlantListProps {
  plants: PlantMap
}

export const PlantList = inject('plantStore')(
  observer(
    (): ReactElement => {
      const {
        plantList,
        modifyPlant,
        setPlants,
        plants,
        sortingMode,
        sortingDirection,
        setSortingMode,
        setSortingDirection,
      } = plantStore
      const addTestPlant = () => {
        const index = String(Math.floor(Math.random() * 1000))
        let newPlantList: PlantMap = {}
        newPlantList[index] = { id: index, name: 'Test Plant' }
        const newPlants = {
          ...newPlantList,
          ...plants,
        }
        console.log(newPlants)
        setPlants(newPlants)
      }

      const handleChangeSortingMode = (mode: SortingMode): void => {
        setSortingMode(mode)
      }

      const handleToggleSortingDirection = (): void => {
        setSortingDirection(
          sortingDirection === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC
        )
      }

      return (
        <div>
          <Typography variant="h4">Plants</Typography>
          <Typography>{`Current sorting mode: ${sortingMode}`}</Typography>
          <Typography>{`Current sorting direction: ${sortingDirection}`}</Typography>
          <button onClick={() => addTestPlant()}>Test Add Plant</button>
          <button onClick={() => handleChangeSortingMode(SortingMode.NAME)}>Sort by name</button>
          <button onClick={() => handleChangeSortingMode(SortingMode.WATER)}>
            Sort by last watered
          </button>
          <button onClick={() => handleChangeSortingMode(SortingMode.FERTILIZE)}>
            Sort by last fertilized
          </button>
          <button onClick={() => handleToggleSortingDirection()}>Toggle direction</button>
          {plantList.map((plant: Plant) => (
            <ListRow key={plant.id} plant={plant} handleModifyPlant={modifyPlant} />
          ))}
        </div>
      )
    }
  )
)

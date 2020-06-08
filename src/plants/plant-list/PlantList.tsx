import React, { ReactElement } from 'react'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import { Plant, PlantMap, SortingMode, SortingDirection } from '../../models'
import { plantStore } from '../../injectables'
import { ListRow } from './components'

export interface PlantListProps {
  plants: PlantMap
}

export const PlantList = inject('plantStore')(
  observer(
    (): ReactElement => {
      const {
        plantsToWaterList,
        plantsRemainingList,
        modifyPlant,
        setPlants,
        plants,
        sortingMode,
        sortingDirection,
        setSortingMode,
        setSortingDirection,
      } = plantStore

      const handleChangeSortingMode = (mode: SortingMode): void => {
        setSortingMode(mode)
      }

      const handleToggleSortingDirection = (): void => {
        setSortingDirection(
          sortingDirection === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC
        )
      }

      return (
        <>
          <div className='plant-list__row-container'>
            {plantsToWaterList.map((plant: Plant) => (
              <ListRow key={plant.id} plant={plant} handleModifyPlant={modifyPlant} />
            ))}
          </div>
          <div className='plant-list__row-container'>
            {plantsRemainingList.map((plant: Plant) => (
              <ListRow key={plant.id} plant={plant} handleModifyPlant={modifyPlant} />
            ))}
          </div>
        </>
      )
    }
  )
)

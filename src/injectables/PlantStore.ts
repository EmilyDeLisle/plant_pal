import { observable, computed, action, decorate } from 'mobx'
import moment from 'moment'
import { Plant, PlantMap, PlantEventType, SortingMode, SortingDirection } from '../models'
import { getComparator } from './sortingHelpers'

class PlantStore {
  plants: PlantMap = {}
  sortingMode: SortingMode = SortingMode.WATER
  sortingDirection: SortingDirection = SortingDirection.DESC

  get plantList() {
    const list = Object.values(this.plants)
    return list.sort(getComparator(this.sortingDirection, this.sortingMode))
  }

  get plantsToWaterList() {
    return this.plantList.filter(plant => {
      const avgWateringInterval = plant.getAvgWateringInterval()
      if (!!plant.daysSinceLastWatered && !!avgWateringInterval) {
        return plant.daysSinceLastWatered >= avgWateringInterval
      }
    })
  }

  setPlants = (plants: PlantMap): void => {
    this.plants = plants
  }

  setSortingMode = (sortingMode: SortingMode): void => {
    this.sortingMode = sortingMode
  }

  setSortingDirection = (sortingDirection: SortingDirection): void => {
    this.sortingDirection = sortingDirection
  }

  modifyPlant = (plantID: string, eventType: PlantEventType, date?: string): void => {
    const plant: Plant = this.plants[plantID]
    const newDate = !!date ? date : moment().utc().format()
    let newPlant: Plant = new Plant(plant.id, plant.name)
    if (eventType === PlantEventType.WATER) {
      newPlant.setWateringDates(!!plant.wateringDates ? [newDate, ...plant.wateringDates] : [newDate])
      !!plant.fertilizingDates && newPlant.setFertilizingDates(plant.fertilizingDates)
    } else {
      !!plant.wateringDates && newPlant.setWateringDates(plant.wateringDates)
      newPlant.setFertilizingDates(!!plant.fertilizingDates ? [newDate, ...plant.fertilizingDates] : [newDate])
    }
    this.plants[plantID] = newPlant
  }
}

decorate(PlantStore, {
  plants: observable,
  sortingMode: observable,
  sortingDirection: observable,
  plantList: computed,
  setPlants: action,
  setSortingMode: action,
  setSortingDirection: action,
  // modifyPlant: action,
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

export default plantStore

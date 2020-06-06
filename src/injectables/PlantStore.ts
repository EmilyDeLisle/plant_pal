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
        return !plant.checkedToday && plant.daysSinceLastWatered >= avgWateringInterval
      }
    })
  }

  get plantsRemainingList() {
    return this.plantList.filter(plant => !this.plantsToWaterList.includes(plant))
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
    const { id, name, wateringDates, fertilizingDates, checkedDate } = plant
    const newDate = !!date ? date : moment().utc().format()
    let newPlant
    switch (eventType) {
      case PlantEventType.CHECK:
        newPlant = new Plant(id, name, wateringDates, fertilizingDates, moment().utc().format())
        break
      case PlantEventType.FERTILIZE:
        const newFertilizingDates = !!plant.wateringDates ? [newDate, ...plant.wateringDates] : [newDate]
        newPlant = new Plant(id, name, wateringDates, newFertilizingDates, checkedDate)
        break
      default:
        const newWateringDates = !!plant.wateringDates ? [newDate, ...plant.wateringDates] : [newDate]
        newPlant = new Plant(id, name, wateringDates, newWateringDates, checkedDate)
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
  modifyPlant: action,
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

export default plantStore

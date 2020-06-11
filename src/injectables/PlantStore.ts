import { observable, computed, action, decorate } from 'mobx'
import moment from 'moment'
import { Plant, PlantMap, PlantEventType, SortingMode, SortingDirection } from '../models'
import { getComparator } from '../utils'

class PlantStore {
  plants: PlantMap = {}
  selectedPlant: Plant | undefined = undefined
  sortingMode: SortingMode = SortingMode.WATER
  sortingDirection: SortingDirection = SortingDirection.ASC

  get plantList() {
    const list = Object.values(this.plants)
    return list.sort(getComparator(this.sortingDirection, this.sortingMode))
  }

  get plantsToWaterList() {
    return this.plantList.filter((plant) => plant.toBeChecked)
  }

  get plantsRemainingList() {
    return this.plantList.filter((plant) => !this.plantsToWaterList.includes(plant))
  }

  setPlants = (plants: PlantMap): void => {
    this.plants = plants
  }

  setSelectedPlant = (plantID: string): void => {
    this.selectedPlant = this.plants[plantID]
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
        const newFertilizingDates = !!plant.fertilizingDates
          ? [newDate, ...plant.fertilizingDates]
          : [newDate]
        newPlant = new Plant(id, name, wateringDates, newFertilizingDates, checkedDate)
        break
      default:
        const newWateringDates = !!plant.wateringDates
          ? [newDate, ...plant.wateringDates]
          : [newDate]
        newPlant = new Plant(id, name, newWateringDates, fertilizingDates, checkedDate)
    }
    this.plants[plantID] = newPlant
  }
}

decorate(PlantStore, {
  plants: observable,
  selectedPlant: observable,
  sortingMode: observable,
  sortingDirection: observable,
  plantList: computed,
  setPlants: action,
  setSelectedPlant: action,
  setSortingMode: action,
  setSortingDirection: action,
  modifyPlant: action,
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

// for testing
const test_plants = {
  '123': new Plant(
    '123',
    'Plant Fren',
    [
      '2020-06-07T21:36:41Z',
      '2020-05-29T21:36:41Z',
      '2020-05-22T21:36:41Z',
      '2020-03-25T21:36:41Z',
    ],
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

plantStore.setPlants(test_plants)

export default plantStore

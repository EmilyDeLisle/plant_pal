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
    const listName = `${eventType}Dates`
    const eventList = plant[listName]
    let newPlant: Plant = {...plant}
    newPlant[listName] = !!eventList ? [newDate, ...eventList] : [newDate]
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

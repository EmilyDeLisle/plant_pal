import { observable, computed, action, decorate } from 'mobx'
import moment, { Moment } from 'moment'
import { Plant, PlantMap, PlantEventType } from '../models'

class PlantStore {
  plants: PlantMap = {}

  get plantList() {
    return Object.values(this.plants)
  }

  setPlants = (plants: PlantMap): void => {
    this.plants = plants
  }

  modifyPlant = (plantID: string, eventType: PlantEventType, date?: string): void => {
    const plant: Plant = this.plants[plantID]
    const newDate = !!date ? date : moment().utc().format()
    let dateList: string[] | undefined
    let listName: string
    if (eventType === PlantEventType.WATER) {
      dateList = plant.wateringDates
      listName = 'wateringDates'
    } else {
      dateList = plant.fertilizingDates
      listName = 'fertilizingDates'
    }
    let newPlant: Plant = {...plant}
    newPlant[listName] = !!dateList ? [newDate, ...dateList] : [newDate]
    this.plants[plantID] = newPlant
  }
}

decorate(PlantStore, {
  plants: observable,
  plantList: computed,
  setPlants: action,
  modifyPlant: action,
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

export default plantStore

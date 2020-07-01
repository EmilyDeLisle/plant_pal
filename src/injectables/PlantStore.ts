import { observable, computed, action, decorate } from 'mobx'
import {
  InspectorMode,
  Plant,
  PlantDialogMode,
  PlantMap,
  SortingMode,
  SortingDirection,
} from '../models'
import { getComparator } from '../utils'
import { DatabaseManager, getDatabase } from '../firebase'

class PlantStore {
  db = getDatabase()
  plants: PlantMap = {}
  selectedPlantID: string | undefined = undefined
  sortingMode: SortingMode = SortingMode.WATER
  sortingDirection: SortingDirection = SortingDirection.ASC
  dialogMode: PlantDialogMode = PlantDialogMode.VIEW
  inspectorMode: InspectorMode = InspectorMode.DEFAULT

  getPlants() {
    this.db?.getPlants((plants: PlantMap) => this.setPlants(plants))
  }

  get plantList() {
    return Object.values(this.plants).sort(getComparator(this.sortingDirection, this.sortingMode))
  }

  get plantsToWaterList() {
    return this.plantList.filter((plant) => plant.toBeChecked)
  }

  get plantsRemainingList() {
    return this.plantList.filter((plant) => !plant.toBeChecked)
  }

  get selectedPlant() {
    return !!this.selectedPlantID ? this.plants[this.selectedPlantID] : undefined
  }

  setPlants = (plants: PlantMap): void => {
    this.plants = plants
  }

  setSelectedPlantID = (plantID: string): void => {
    this.selectedPlantID = plantID
  }

  setSortingMode = (sortingMode: SortingMode): void => {
    this.sortingMode = sortingMode
  }

  setSortingDirection = (sortingDirection: SortingDirection): void => {
    this.sortingDirection = sortingDirection
  }

  setDialogMode = (dialogMode: PlantDialogMode): void => {
    this.dialogMode = dialogMode
  }

  setInspectorMode = (inspectorMode: InspectorMode): void => {
    this.inspectorMode = inspectorMode
  }

  clearStore = (): void => {
    this.plants = {}
    this.selectedPlantID = undefined
    this.sortingMode = SortingMode.WATER
    this.sortingDirection = SortingDirection.ASC
    this.dialogMode = PlantDialogMode.VIEW
    this.inspectorMode = InspectorMode.DEFAULT
  }
}

decorate(PlantStore, {
  plants: observable,
  selectedPlantID: observable,
  sortingMode: observable,
  sortingDirection: observable,
  inspectorMode: observable,
  plantList: computed,
  plantsToWaterList: computed,
  plantsRemainingList: computed,
  selectedPlant: computed,
  setPlants: action,
  setSortingMode: action,
  setSortingDirection: action,
  setSelectedPlantID: action,
  setInspectorMode: action
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

export default plantStore

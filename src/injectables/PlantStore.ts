import { observable, computed, action, decorate } from 'mobx'
import {
  InspectorMode,
  Plant,
  PlantMap,
  SortingMode,
  SortingDirection,
} from '../models'
import { getComparator } from '../utils'
import { getDatabase } from '../firebase'

class PlantStore {
  db = getDatabase()
  plants: PlantMap = {}
  selectedPlantID: string | undefined = undefined
  sortingMode: SortingMode = SortingMode.DAYS_TO_WATER
  sortingDirection: SortingDirection = SortingDirection.ASC
  inspectorMode: InspectorMode = InspectorMode.ADD
  plantsLoaded: boolean = false
  searchValue: string = ''

  getPlants() {
    this.db?.getPlants((plants: PlantMap) => {
      this.setPlants(plants)
      this.setPlantsLoaded(true)
    })
  }

  get plantList() {
    return Object.values(this.plants)
      .filter(({ name }: Plant) => {
        return name.toLowerCase().includes(this.searchValue.toLowerCase())
      })
      .sort(getComparator(this.sortingDirection, this.sortingMode))
  }

  get plantsNeedingAttentionList() {
    return this.plantList.filter((plant) => plant.toBeChecked)
  }

  get plantsRemainingList() {
    return this.plantList.filter((plant) => !plant.toBeChecked)
  }

  get plantCount() {
    return Object.keys(this.plants).length
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

  setInspectorMode = (inspectorMode: InspectorMode): void => {
    this.inspectorMode = inspectorMode
  }

  setPlantsLoaded = (loaded: boolean): void => {
    this.plantsLoaded = loaded
  }

  setSearchValue = (value: string): void => {
    this.searchValue = value
  }

  clearStore = (): void => {
    this.plants = {}
    this.selectedPlantID = undefined
    this.sortingMode = SortingMode.DAYS_TO_WATER
    this.sortingDirection = SortingDirection.ASC
    this.inspectorMode = InspectorMode.ADD
    this.plantsLoaded = false
    this.searchValue = ''
  }
}

decorate(PlantStore, {
  plants: observable,
  selectedPlantID: observable,
  sortingMode: observable,
  sortingDirection: observable,
  inspectorMode: observable,
  plantsLoaded: observable,
  searchValue: observable,
  plantList: computed,
  plantsNeedingAttentionList: computed,
  plantsRemainingList: computed,
  plantCount: computed,
  selectedPlant: computed,
  setPlants: action,
  setSortingMode: action,
  setSortingDirection: action,
  setSelectedPlantID: action,
  setInspectorMode: action,
  setPlantsLoaded: action,
  setSearchValue: action,
})

export interface PlantStoreProps {
  plantStore?: PlantStore
}

let plantStore = new PlantStore()

export default plantStore

import firebase from 'firebase/app'
import 'firebase/firestore'
import { PlantModel, Plant, PlantMap } from '../models'
import { plantStore } from '../injectables'

/**
 * This class is used to simplify the interaction between the UI and participant collections.
 */
export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: any = null

  /**
   * Get an instance of DatabaseManager.
   * @returns {DatabaseManager}
   *  Instance of DatabaseManager
   */
  static getInstance() {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  constructor() {
    if (DatabaseManager.instance) {
      throw new Error('DatabaseManager is a singleton class')
    }
    this.db = firebase.firestore()
  }

  getPlants = (handlePlants: Function, onSuccess?: Function, onError?: Function): void => {
    let plants: PlantMap = {}
    this.db
      .collection('users/test-user/plants')
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          const data: PlantModel = doc.data()
          const { name, altName, wateringDates, fertilizingDates, lastCheckedDate } = data
          const plant = new Plant(
            doc.id,
            name,
            altName,
            wateringDates,
            fertilizingDates,
            lastCheckedDate
          )
          plants[doc.id] = plant
        })
        handlePlants(plants)
      })
      .then(onSuccess)
      .catch(onError)
  }
}

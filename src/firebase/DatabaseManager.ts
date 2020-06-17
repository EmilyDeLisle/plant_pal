import firebase from 'firebase/app'
import 'firebase/firestore'
import { PlantModel, Plant, PlantMap } from '../models'

/**
 * This class is used to simplify the interaction between the UI and participant collections.
 */
export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: firebase.firestore.Firestore | null = null

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

  getPlants = (handlePlants: (plants: PlantMap) => void): void => {
    !!this.db &&
      this.db.collection('users/test-user/plants').onSnapshot((querySnapshot: any) => {
        let plants: PlantMap = {}
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
  }

  addPlant = (
    plant: any,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    let docRef = this.db?.collection('users/test-user/plants').doc()
    !!docRef &&
      docRef
        .set({ ...plant, id: docRef.id })
        .then(onSuccess)
        .catch(onError)
  }
}

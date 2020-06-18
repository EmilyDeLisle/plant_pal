import firebase, { firestore } from 'firebase'
import 'firebase/firestore'
import { Moment } from 'moment'
import { Plant, PlantEventType, PlantMap, PlantProps } from '../models'
import { plantConverter } from '../utils'

/**
 * This class is used to simplify the interaction between the UI and participant collections.
 */
export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: firestore.Firestore | null = null

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
    const collectionRef = this.db?.collection('users/test-user/plants')
    !!collectionRef &&
      collectionRef
        .withConverter(plantConverter)
        .onSnapshot((querySnapshot: firestore.QuerySnapshot<Plant>) => {
          let plants: PlantMap = {}
          querySnapshot.forEach((plantSnapshot: firestore.QueryDocumentSnapshot<Plant>) => {
            const plant = plantSnapshot.data()
            plants[plant.id] = plant
          })
          handlePlants(plants)
        })
  }

  addPlant = (
    plant: Plant,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    const docRef = this.db?.collection('users/test-user/plants').doc()
    !!docRef && docRef.withConverter(plantConverter).set(plant).then(onSuccess).catch(onError)
  }

  modifyPlant = (
    plantID: string,
    eventType: PlantEventType,
    date?: Moment,
    eventList?: firestore.Timestamp[],
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ) => {
    const docRef = this.db?.collection('users/test-user/plants').doc(plantID)
    const newDate = !!date ? firestore.Timestamp.fromDate(date.toDate()) : firestore.Timestamp.now()
    let updateValue = undefined
    if (!!eventList) {
      if (eventType === PlantEventType.WATER) {
        updateValue = {
          wateringDates: firestore.FieldValue.arrayUnion(newDate),
        }
      } else if (eventType === PlantEventType.FERTILIZE) {
        updateValue = {
          fertilizingDates: [newDate, ...eventList],
        }
      }
    } else if (eventType === PlantEventType.CHECK) {
      updateValue = {
        lastCheckedDate: newDate,
      }
    }
    !!docRef && !!updateValue && docRef.update(updateValue).then(onSuccess).catch(onError)
  }
}

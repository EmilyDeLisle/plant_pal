import firebase, { auth, firestore } from 'firebase'
import 'firebase/firestore'
import { Moment } from 'moment'
import { Plant, PlantEventType, PlantMap } from '../models'
import { plantConverter, isDateUnavailable } from '../utils'
import { getAuth } from './init'

/**
 * This class is used to simplify the interaction between the UI and participant collections.
 */
export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: firestore.Firestore | null = null
  collectionRef: firestore.CollectionReference<firestore.DocumentData> | undefined

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
    const uuid = getAuth().getCurrentUser()?.uid
    if (!this.collectionRef && !!uuid) {
      this.collectionRef = this.db?.collection(`users/${uuid}/plants`)
    }
    !!this.collectionRef &&
      this.collectionRef
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
    const docRef = this.collectionRef?.doc()
    !!docRef && docRef.withConverter(plantConverter).set(plant).then(onSuccess).catch(onError)
  }

  modifyPlant = (
    plant: Plant,
    eventType: PlantEventType,
    date?: Moment,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ) => {
    const { id, getEventDateList } = plant
    const docRef = this.collectionRef?.doc(id)
    const today = firestore.Timestamp.now()
    const newDate = !!date ? firestore.Timestamp.fromDate(date.toDate()) : today
    const eventList = getEventDateList(eventType)

    let updateValue = undefined
    if (!!eventList) {
      const dateUnavailable = isDateUnavailable(newDate, eventList)
      if (eventType === PlantEventType.WATER && !dateUnavailable) {
        updateValue = {
          wateringDates: [newDate, ...eventList],
        }
      } else if (eventType === PlantEventType.FERTILIZE && !dateUnavailable) {
        updateValue = {
          fertilizingDates: [newDate, ...eventList],
        }
      } else if (eventType === PlantEventType.CHECK) {
        updateValue = {
          lastCheckedDate: newDate,
        }
      }
      !!docRef && !!updateValue && docRef.update(updateValue).then(onSuccess).catch(onError)
    }
  }
}

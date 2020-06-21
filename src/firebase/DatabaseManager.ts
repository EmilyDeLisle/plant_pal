import firebase, { firestore } from 'firebase'
import 'firebase/firestore'
import { Moment } from 'moment'
import { FormValues, Plant, PlantEventType, PlantMap } from '../models'
import { plantConverter, isDateUnavailable } from '../utils'
import { getAuth } from './init'

export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: firestore.Firestore | null = null
  collectionRef: firestore.CollectionReference<firestore.DocumentData> | undefined
  unsubscribe: (() => void) | undefined

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
    this.unsubscribe = this.collectionRef
      ?.withConverter(plantConverter)
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
    this.collectionRef
      ?.doc()
      ?.withConverter(plantConverter)
      .set(plant)
      .then(onSuccess)
      .catch(onError)
  }

  updatePlantNames = (
    id: string,
    values: FormValues,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.collectionRef?.doc(id)?.update(values).then(onSuccess).catch(onError)
  }

  deleteEvent = (
    id: string,
    eventType: PlantEventType,
    event: firestore.Timestamp,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.collectionRef
      ?.doc(id)
      ?.update({
        [eventType === PlantEventType.WATER
          ? 'wateringDates'
          : 'fertilizingDates']: firestore.FieldValue.arrayRemove(event),
      })
      .then(onSuccess)
      .catch(onError)
  }

  modifyPlant = (
    plant: Plant,
    eventType: PlantEventType,
    date?: Moment,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ) => {
    const { id, getEventDateList } = plant
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
      }
    } else if (eventType === PlantEventType.CHECK) {
      updateValue = {
        lastCheckedDate: newDate,
      }
    }
    if (!!updateValue) {
      this.collectionRef?.doc(id)?.update(updateValue).then(onSuccess).catch(onError)
    }
  }
}

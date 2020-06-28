import firebase, { firestore } from 'firebase'
import 'firebase/firestore'
import { Moment } from 'moment'
import { FormValues, Plant, PlantEventType, PlantMap, PlantProps } from '../models'
import { plantConverter, isDateUnavailable } from '../utils'
import { getAuth } from './init'

export default class DatabaseManager {
  static instance: DatabaseManager | null = null
  db: firestore.Firestore | null = null
  collectionRef: firestore.CollectionReference<firestore.DocumentData> | undefined
  uuid?: string
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

  setReference = () => {
    this.uuid = getAuth().getCurrentUser()?.uid
    if (!this.collectionRef && !!this.uuid) {
      this.collectionRef = this.db?.collection(`users/${this.uuid}/plants`)
    }
  }

  getPlants = (handlePlants: (plants: PlantMap) => void): void => {
    this.setReference()
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
    plantValues: PlantProps,
    fileName?: string,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): string | undefined => {
    this.setReference()
    const docRef = this.collectionRef?.doc()
    const id = docRef?.id
    if (!!docRef) {
      const imageFileName = !!fileName ? fileName : ''
      const plant = new Plant({ ...plantValues, id: id, imageFileName })
      !!plant && docRef.withConverter(plantConverter).set(plant).then(onSuccess).catch(onError)
    }
    return id
  }

  updatePlantNames = (
    id: string,
    values: FormValues,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.setReference()
    this.collectionRef?.doc(id)?.update(values).then(onSuccess).catch(onError)
  }

  updatePlantImageFileName = (
    id: string,
    fileName: string,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.setReference()
    this.collectionRef?.doc(id)?.update({ imageFileName: fileName }).then(onSuccess).catch(onError)
  }

  deleteEvent = (
    id: string,
    eventType: PlantEventType,
    event: firestore.Timestamp,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.setReference()
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

  deletePlant = (
    id: string,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): void => {
    this.setReference()
    this.collectionRef?.doc(id)?.delete().then(onSuccess).catch(onError)
  }

  modifyPlant = (
    plant: Plant,
    eventType: PlantEventType,
    date?: Moment,
    onSuccess?: ((value: void) => void | PromiseLike<void>) | null | undefined,
    onError?: ((reason: any) => PromiseLike<never>) | null | undefined
  ) => {
    this.setReference()
    const { id, getEventDateList } = plant
    const today = firestore.Timestamp.now()
    const newDate = !!date ? firestore.Timestamp.fromDate(date.toDate()) : today

    let updateValue = undefined

    if (eventType === PlantEventType.CHECK) {
      updateValue = {
        lastCheckedDate: newDate,
      }
    } else {
      const eventList = getEventDateList(eventType)
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
    }
    if (!!updateValue) {
      this.collectionRef?.doc(id)?.update(updateValue).then(onSuccess).catch(onError)
    }
  }
}

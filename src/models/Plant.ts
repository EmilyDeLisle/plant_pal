import moment from 'moment'
import { action, computed, decorate, observable } from 'mobx'
import { firestore } from 'firebase'
import { calculateDays, isNullOrUndefined } from '../utils'
import { IntervalMap } from './Map'
import { PlantEventType } from './PlantEventType'
import { HOURS_IN_DAY } from './Time'

export interface PlantValues {
  name: string
  altName: string
  fertilizingDates: firestore.Timestamp[]
  lastCheckedDate: firestore.Timestamp[] | null
  wateringDates: firestore.Timestamp[]
}

const emptyIntervals: IntervalMap = {
  1: null,
  2: null,
  3: null,
  6: null,
  12: null,
  Infinity: null,
}

export interface PlantProps {
  id?: string
  name: string
  altName?: string
  fertilizingDates?: firestore.Timestamp[]
  fertilizingIntervals?: IntervalMap
  lastFertilizedDate?: firestore.Timestamp | null
  wateringDates?: firestore.Timestamp[]
  wateringIntervals?: IntervalMap
  lastWateredDate?: firestore.Timestamp | null
  lastCheckedDate?: firestore.Timestamp | null
  imageFileName?: string
  imageURL?: string
}

export class Plant {
  id: string
  name: string
  altName: string
  fertilizingDates: firestore.Timestamp[]
  fertilizingIntervals: IntervalMap
  lastFertilizedDate: firestore.Timestamp | null
  wateringDates: firestore.Timestamp[]
  wateringIntervals: IntervalMap
  lastWateredDate: firestore.Timestamp | null
  lastCheckedDate: firestore.Timestamp | null
  imageFileName: string
  imageURL: string | undefined

  constructor({
    id = '',
    name,
    altName = '',
    wateringDates = [],
    fertilizingDates = [],
    fertilizingIntervals = emptyIntervals,
    lastFertilizedDate = null,
    wateringIntervals = emptyIntervals,
    lastWateredDate = null,
    lastCheckedDate = null,
    imageFileName = '',
  }: PlantProps) {
    this.id = id
    this.name = name
    this.altName = altName
    this.fertilizingDates = fertilizingDates
    this.fertilizingIntervals = fertilizingIntervals
    this.lastFertilizedDate = lastFertilizedDate
    this.wateringDates = wateringDates
    this.wateringIntervals = wateringIntervals
    this.lastWateredDate = lastWateredDate
    this.lastCheckedDate = lastCheckedDate
    this.imageFileName = imageFileName
  }

  get daysSinceLastWatered(): number | undefined {
    return !!this.lastWateredDate ? calculateDays(moment(this.lastWateredDate.toDate())) : undefined
  }

  get daysSinceLastFertilized(): number | undefined {
    return !!this.lastFertilizedDate
      ? calculateDays(moment(this.lastFertilizedDate.toDate()))
      : undefined
  }

  get daysToWater(): number | undefined {
    const interval = this.getAvgInterval(PlantEventType.WATER)
    return !isNullOrUndefined(interval) && this.daysSinceLastWatered !== undefined ? interval! - this.daysSinceLastWatered : undefined
  }

  get checkedToday(): boolean {
    return !!this.lastCheckedDate
      ? moment().diff(moment(this.lastCheckedDate.toDate()), 'hours') < HOURS_IN_DAY
      : false
  }

  get toBeChecked(): boolean {
    const avgWateringInterval = this.getAvgInterval(PlantEventType.WATER)
    return (
      !!this.daysSinceLastWatered &&
      !!avgWateringInterval &&
      !this.checkedToday &&
      this.daysSinceLastWatered >= avgWateringInterval
    )
  }

  get isFertilized(): boolean {
    if (!!this.lastWateredDate && !!this.lastFertilizedDate) {
      return (
        moment(this.lastWateredDate.toDate()).diff(
          moment(this.lastFertilizedDate.toDate()),
          'days'
        ) === 0
      )
    } else if (!this.lastWateredDate && this.lastFertilizedDate) {
      return true
    }
    return false
  }

  getLastEventDate = (eventType: PlantEventType): firestore.Timestamp | null => {
    return eventType === PlantEventType.FERTILIZE ? this.lastFertilizedDate : this.lastWateredDate
  }

  getEventDateList = (eventType: PlantEventType, periodLength?: number): firestore.Timestamp[] => {
    const eventDates =
      eventType === PlantEventType.FERTILIZE ? this.fertilizingDates : this.wateringDates
    return !!periodLength
      ? eventDates.filter((date) => moment().diff(moment(date.toDate()), 'months') < periodLength)
      : eventDates
  }

  getAvgInterval = (eventType: PlantEventType, periodLength: number = 3): number | null => {
    return eventType === PlantEventType.WATER
      ? this.wateringIntervals[periodLength]
      : this.fertilizingIntervals[periodLength]
  }

  setName = (name: string): void => {
    this.name = name
  }

  setAltName = (altName: string): void => {
    this.altName = altName
  }

  setImageURL = (url: string): void => {
    this.imageURL = url
  }
}

decorate(Plant, {
  name: observable,
  altName: observable,
  wateringDates: observable,
  fertilizingDates: observable,
  lastCheckedDate: observable,
  imageURL: observable,
  daysSinceLastWatered: computed,
  daysSinceLastFertilized: computed,
  daysToWater: computed,
  checkedToday: computed,
  isFertilized: computed,
  setName: action,
  setAltName: action,
  setImageURL: action,
})

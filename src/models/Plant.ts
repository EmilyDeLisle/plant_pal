import moment, { Moment } from 'moment'
import { action, computed, decorate, observable } from 'mobx'
import { firestore } from 'firebase'
import { IntervalMap } from '../models'
import { PlantEventType } from './PlantEventType'

const HOURS_IN_DAY = 24

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
  }

  get daysSinceLastWatered(): number | undefined {
    return !!this.lastWateredDate
      ? moment().diff(moment(this.lastWateredDate.toDate()), 'days')
      : undefined
  }

  get daysSinceLastFertilized(): number | undefined {
    return !!this.lastFertilizedDate
      ? moment().diff(moment(this.lastFertilizedDate.toDate()), 'days')
      : undefined
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
}

decorate(Plant, {
  name: observable,
  altName: observable,
  wateringDates: observable,
  fertilizingDates: observable,
  lastCheckedDate: observable,
  daysSinceLastWatered: computed,
  daysSinceLastFertilized: computed,
  checkedToday: computed,
  setName: action,
  setAltName: action,
})

import moment from 'moment'
import { action, computed, decorate, observable } from 'mobx'
import { PlantEventType } from './PlantEventType'
const HOURS_IN_DAY = 24

export class Plant {
  id: string
  name: string
  wateringDates: string[] = []
  fertilizingDates: string[] = []
  checkedDate?: string

  constructor(
    id: string,
    name: string,
    wateringDates: string[] = [],
    fertilizingDates: string[] = [],
    checkedDate?: string
  ) {
    this.id = id
    this.name = name
    this.wateringDates = wateringDates
    this.fertilizingDates = fertilizingDates
    this.checkedDate = checkedDate
  }

  get lastWateredDate(): string | undefined {
    return this.wateringDates.length > 0 ? this.wateringDates[0] : undefined
  }

  get lastFertilizedDate(): string | undefined {
    return this.fertilizingDates.length > 0 ? this.fertilizingDates[0] : undefined
  }

  get daysSinceLastWatered(): number | undefined {
    return !!this.lastWateredDate ? moment().diff(this.lastWateredDate, 'days') : undefined
  }

  get daysSinceLastFertilized(): number | undefined {
    return !!this.lastFertilizedDate ? moment().diff(this.lastFertilizedDate, 'days') : undefined
  }

  get checkedToday(): boolean {
    return !!this.checkedDate ? moment().diff(this.checkedDate, 'hours') < HOURS_IN_DAY : false
  }

  get toBeChecked(): boolean {
    const avgWateringInterval = this.getAvgWateringInterval()
    return (
      !!this.daysSinceLastWatered &&
      !!avgWateringInterval &&
      !this.checkedToday &&
      this.daysSinceLastWatered >= avgWateringInterval
    )
  }

  getLastEventDate = (eventType: PlantEventType): string | undefined => {
    return eventType === PlantEventType.FERTILIZE ? this.lastFertilizedDate : this.lastWateredDate
  }

  getEventDateList = (eventType: PlantEventType): string[] => {
    return eventType === PlantEventType.FERTILIZE ? this.fertilizingDates : this.wateringDates
  }

  getAvgInterval = (
    periodLength: number = 3,
    eventType: PlantEventType
  ): number | undefined => {
    const eventDates = eventType ===PlantEventType.WATER ? this.wateringDates : this.fertilizingDates
    if (eventDates.length < 2) {
      return undefined
    }
    let numIntervals = 0
    let totalDays = 0
    eventDates.forEach((date, index) => {
      if (index > 0 && moment().diff(date, 'months') < periodLength) {
        totalDays += moment(eventDates![index - 1]).diff(moment(date), 'days')
        numIntervals++
      }
    })
    return Math.round(totalDays / numIntervals)
  }

  getAvgWateringInterval = (periodLength: number = 3): number | undefined => {
    // if dates undefined or less than 2, can't calculate an interval & return undefined
    if (!this.wateringDates || this.wateringDates.length < 2) {
      return undefined
    }

    let numIntervals = 0
    let totalDays = 0

    this.wateringDates.forEach((date, index) => {
      if (index > 0 && moment().diff(date, 'months') < periodLength) {
        totalDays += moment(this.wateringDates![index - 1]).diff(moment(date), 'days')
        numIntervals++
      }
    })

    return Math.round(totalDays / numIntervals)
  }

  getAvgFertilizingInterval = (periodLength: number = 3): number | undefined => {
    // if dates undefined or less than 2, can't calculate an interval & return undefined
    if (!this.fertilizingDates || this.fertilizingDates.length < 2) {
      return undefined
    }

    let numIntervals = 0
    let totalDays = 0

    this.fertilizingDates.forEach((date, index) => {
      if (index > 0 && moment().diff(date, 'months') < periodLength) {
        totalDays += moment(this.fertilizingDates![index - 1]).diff(moment(date), 'days')
        numIntervals++
      }
    })

    return Math.round(totalDays / numIntervals)
  }

  setName = (name: string): void => {
    this.name = name
  }

  setWateringDates = (dates: string[]): void => {
    this.wateringDates = dates
  }

  setFertilizingDates = (dates: string[]): void => {
    this.fertilizingDates = dates
    console.log(this.fertilizingDates)
  }

  setCheckedDate = (date: string): void => {
    this.checkedDate = date
  }

  modifyPlant = (eventType: PlantEventType, date?: string): void => {
    const newDate = !!date ? date : moment().utc().format()
    switch (eventType) {
      case PlantEventType.CHECK:
        this.setCheckedDate(moment().utc().format())
        break
      case PlantEventType.WATER:
        console.log('water')
        this.setWateringDates([newDate, ...this.wateringDates])
        break
      default:
        console.log('fertilize')
        this.setFertilizingDates([newDate, ...this.fertilizingDates])
    }
  }
}

decorate(Plant, {
  name: observable,
  wateringDates: observable,
  fertilizingDates: observable,
  checkedDate: observable,
  lastWateredDate: computed,
  lastFertilizedDate: computed,
  daysSinceLastWatered: computed,
  daysSinceLastFertilized: computed,
  checkedToday: computed,
  setName: action,
  setWateringDates: action,
  setFertilizingDates: action,
  setCheckedDate: action,
})

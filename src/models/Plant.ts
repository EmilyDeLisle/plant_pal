import moment, { Moment } from 'moment'
import { action, computed, decorate, observable } from 'mobx'
import { isToday, compareDate } from '../utils'
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
    const avgWateringInterval = this.getAvgInterval(PlantEventType.WATER)
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

  getAvgInterval = (eventType: PlantEventType, periodLength: number = 3): number | undefined => {
    const eventDates = this.getEventDateList(eventType)
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

  checkEventDateExists = (eventType: PlantEventType, newDate: Moment): boolean => {
    const eventDates = this.getEventDateList(eventType)
    let disableDate = false
    eventDates.forEach((date) => {
      if (!!date && newDate.isSame(moment(date), 'days')) {
        disableDate = true
      }
    })
    return disableDate
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
    const today = moment()
    const newDate = !!date ? date : today.utc().format()
    switch (eventType) {
      case PlantEventType.CHECK:
        this.setCheckedDate(today.utc().format())
        break
      case PlantEventType.FERTILIZE:
        if (!(!!this.lastFertilizedDate && isToday(this.lastFertilizedDate) && isToday(newDate))) {
          this.setFertilizingDates([newDate, ...this.fertilizingDates].sort(compareDate))
        }
        break
      default:
        if (!(!!this.lastWateredDate && isToday(this.lastWateredDate) && isToday(newDate))) {
          this.setWateringDates([newDate, ...this.wateringDates].sort(compareDate))
        }
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

import moment from 'moment'

const HOURS_IN_DAY = 24

export class Plant {
  id: string
  name: string
  wateringDates?: string[]
  fertilizingDates?: string[]
  checkedDate?: string

  constructor(
    id: string,
    name: string,
    wateringDates?: string[],
    fertilizingDates?: string[],
    checkedDate?: string
  ) {
    this.id = id
    this.name = name
    this.wateringDates = wateringDates
    this.fertilizingDates = fertilizingDates
    this.checkedDate = checkedDate
  }

  get lastWateredDate(): string | undefined {
    return !!this.wateringDates && this.wateringDates.length > 0 ? this.wateringDates[0] : undefined
  }

  get lastFertilizedDate(): string | undefined {
    return !!this.fertilizingDates && this.fertilizingDates.length > 0
      ? this.fertilizingDates[0]
      : undefined
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

  setName = (name: string): void => {
    this.name = name
  }

  setWateringDates = (dates: string[]): void => {
    this.wateringDates = dates
  }

  setFertilizingDates = (dates: string[]): void => {
    this.fertilizingDates = dates
  }

  setCheckedDate = (date: string): void => {
    this.checkedDate = date
  }

  getAvgWateringInterval = (periodLength: number = 90): number | undefined => {
    // if dates undefined or less than 2, can't calculate an interval & return undefined
    if (!this.wateringDates || this.wateringDates.length < 2) {
      return undefined
    }

    let numIntervals = 0
    let total = 0

    this.wateringDates.forEach((date, index) => {
      if (index > 0 && moment().diff(date, 'days') < periodLength) {
        total += moment(this.wateringDates![index - 1]).diff(moment(date), 'days')
        numIntervals++
      }
    })

    return Math.round(total / numIntervals)
  }
}

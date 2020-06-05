import moment from 'moment'
import { Map } from './Map'
import { PlantEventType } from './PlantEventType'

// export interface Plant extends Map {
//   id: string
//   name?: string
//   wateringDates?: string[]
//   fertilizingDates?: string[]
// }

export class Plant {

  id: string
  name: string
  wateringDates?: string[]
  fertilizingDates?: string[]

  constructor(id : string, name: string, wateringDates?: string[], fertilizingDates?: string[]) {
    this.id = id
    this.name = name
    this.wateringDates = wateringDates
    this.fertilizingDates = fertilizingDates
  }

  get lastWateredDate(): string | undefined {
    return !!this.wateringDates && this.wateringDates.length > 0 ? this.wateringDates[0] : undefined
  }

  get lastFertilizedDate(): string | undefined {
    return !!this.fertilizingDates && this.fertilizingDates.length > 0 ? this.fertilizingDates[0] : undefined
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

  getAvgWateringInterval = (periodLength?: number): number | undefined => {
    // if dates undefined or less than 2, can't calculate an interval & return undefined
    if (!this.wateringDates || this.wateringDates.length < 2) {
      return undefined
    }
    
    const numIntervals = this.wateringDates.length - 1
    let total = 0

    this.wateringDates.forEach((date, index) => {
      if (index > 0) {
        total += moment(this.wateringDates![index - 1]).diff(moment(date), 'days')
      }
    })

    return Math.round(total / numIntervals)
  }

}
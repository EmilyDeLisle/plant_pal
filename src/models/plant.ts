import moment, { Moment } from 'moment'
import { Map } from './Map'

export interface Plant extends Map {
  id: string
  name?: string
  wateringDates?: string[]
  fertilizingDates?: string[]
}

// export class Plant {
//   id: string
//   name: string | undefined
//   lastWatered: string | undefined
//   lastFertilized: string | undefined
//   wateringDates: string[]
//   fertilizingDates: string[]

//   constructor({
//     id,
//     name,
//     lastWatered,
//     lastFertilized,
//     wateringDates,
//     fertilizingDates,
//   }: PlantProps) {
//     this.id = id
//     this.name = name
//     this.lastWatered = lastWatered
//     this.lastFertilized = lastFertilized
//     this.wateringDates = !!wateringDates ? wateringDates : []
//     this.fertilizingDates = !!fertilizingDates ? fertilizingDates : []
//   }

//   get daysSinceLastWatered() {
//     return !!this.lastWatered ? moment().diff(this.lastWatered, 'days') : undefined
//   }

//   get daysSinceLastFertilized() {
//     return !!this.lastFertilized ? moment().diff(this.lastFertilized, 'days') : undefined
//   }

//   toString() {
//     return `Plant ID: ${this.id}\n
//       Name: ${this.name}\n
//       Last watered: ${this.lastWatered}\n
//       Last fertilized: ${this.lastFertilized}\n
//       Watering dates: ${this.wateringDates}\n
//       Fertilizing dates: ${this.fertilizingDates}\n
//       Days since last watered: ${this.daysSinceLastWatered}\n
//       Days since last fertilized: ${this.daysSinceLastFertilized}\n`
//   }
// }



import moment, { Moment } from 'moment'

export interface PlantProps {
  id: string
  name?: string
  lastWatered?: string // UTC date
  lastFertilized?: string // UTC date
  wateringDates?: string[]
  fertilizingDates?: string[]
}

export class Plant {
  id: string
  name: string | undefined
  lastWatered: Moment | undefined
  lastFertilized: Moment | undefined
  wateringDates: string[]
  fertilizingDates: string[]

  constructor({
    id,
    name,
    lastWatered,
    lastFertilized,
    wateringDates,
    fertilizingDates,
  }: PlantProps) {
    this.id = id
    this.name = name
    this.lastWatered = !!lastWatered ? moment(lastWatered) : undefined
    this.lastFertilized = !!lastFertilized ? moment(lastFertilized) : undefined
    this.wateringDates = !!wateringDates ? wateringDates : []
    this.fertilizingDates = !!fertilizingDates ? fertilizingDates : []
  }

  get daysSinceLastWatered() {
    return !!this.lastWatered ? moment().diff(this.lastWatered, 'days') : undefined
  }

  get daysSinceLastFertilized() {
    return !!this.lastFertilized ? moment().diff(this.lastFertilized, 'days') : undefined
  }

  waterPlant() {
    // this.wateringDates = [moment().utc().format(), ...this.wateringDates]
    // this.lastWatered = moment() // now
    console.log(`Hello, I am ${this.name}.`)
  }

  fertilizePlant() {
    this.fertilizingDates = [moment().utc().format(), ...this.fertilizingDates]
    this.lastFertilized = moment() // now
  }

  toString() {
    return `Plant ID: ${this.id}\n
      Name: ${this.name}\n
      Last watered: ${this.lastWatered}\n
      Last fertilized: ${this.lastFertilized}\n
      Watering dates: ${this.wateringDates}\n
      Fertilizing dates: ${this.fertilizingDates}\n
      Days since last watered: ${this.daysSinceLastWatered}\n
      Days since last fertilized: ${this.daysSinceLastFertilized}\n`
  }
}

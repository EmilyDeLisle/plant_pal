import { Map } from './Map'

export interface Plant extends Map {
  id: string
  name?: string
  wateringDates?: string[]
  fertilizingDates?: string[]
}

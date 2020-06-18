import { Plant } from './Plant'

export interface Map {
  [key: string]: any
}

export interface PlantMap {
  [key: string]: Plant
}

export interface IntervalMap {
  [key: number]: number | null
}

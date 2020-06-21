import { Moment } from 'moment'

export interface FormValues {
  name: string
  altName: string
  lastWateredDate?: Moment | null
  lastFertilizedDate?: Moment | null
}

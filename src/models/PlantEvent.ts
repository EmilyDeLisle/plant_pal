import { Moment } from 'moment'
import { PlantEventType } from './PlantEventType'

export interface PlantEvent {
  eventType: PlantEventType,
  date?: Moment,
  initialMessage?: string,
  successMessage?: string,
  duplicateMessage?: string,
  errorMessage?: string,
}

import moment, { Moment } from 'moment'
import { firestore } from 'firebase/app'

export const isToday = (date: Moment | null): boolean => {
  return moment().isSame(date, 'date')
}

export const isDateUnavailable = (newEvent: firestore.Timestamp, eventList: firestore.Timestamp[]): boolean => {
  let isUnavailable = false
  eventList.forEach(event => {
    if (moment(newEvent.toDate()).isSame(event.toDate(), 'date')) {
      isUnavailable = true
    }
  })
  return isUnavailable
}

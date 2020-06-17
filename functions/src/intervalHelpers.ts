import * as moment from 'moment'
import { firestore } from 'firebase'

export interface IntervalMap {
  [key: number]: number | null
}

const getEventList = (
  events: firestore.Timestamp[],
  periodLength: number = 3
): firestore.Timestamp[] => {
  return events.filter((date) => moment().diff(moment(date.toDate()), 'months') < periodLength)
}

const getInterval = (events: firestore.Timestamp[]): number | null => {
  if (events.length > 1) {
    const numIntervals = events.length - 1
    let totalDays = 0
    events.forEach((date, index) => {
      if (index > 0) {
        totalDays += moment(events[index - 1].toDate()).diff(moment(date.toDate()), 'days')
      }
    })
    return Math.round(totalDays / numIntervals)
  } else {
    return null
  }
}

export const getIntervals = (events: firestore.Timestamp[]): IntervalMap => {
  const periods = [1, 2, 3, 6, 12, Infinity]
  const intervals: IntervalMap = {}
  periods.forEach((period) => {
    intervals[period] = getInterval(getEventList(events, period))
  })
  return intervals
}

import * as moment from 'moment'
import { firestore } from 'firebase'

export interface IntervalMap {
  [key: number]: number | null
}

export const getEventList = (
  events: firestore.Timestamp[],
  periodLength: number = 3
): firestore.Timestamp[] => {
  return events.filter((date) => moment().diff(moment(date.toDate()), 'months') < periodLength)
}

export const getInterval = (events: firestore.Timestamp[]): number | null => {
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

export const compareDate = (a: firestore.Timestamp, b: firestore.Timestamp): number => {
  const dateA = moment(a.toDate())
  const dateB = moment(b.toDate())
  // if one value is undefined but the other is not, place the undefined value first
  if (!dateB && !!dateA) {
    return -1
  }
  if (!dateA && !!dateB) {
    return 1
  }

  if (!!dateA && !!dateB) {
    if (dateB.isBefore(dateA, 'date')) {
      return -1
    }
    if (dateB.isAfter(dateA, 'date')) {
      return 1
    }
    if (dateB === dateB) {
      return 0
    }
  }
  return 0
}

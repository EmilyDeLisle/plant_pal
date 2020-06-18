import * as firebase from 'firebase'
import * as moment from 'moment'

export interface IntervalMap {
  [key: number]: number | null
}

const getEventList = (
  eventList: firebase.firestore.Timestamp[],
  periodLength: number
): firebase.firestore.Timestamp[] => {
  return eventList.filter((date) => moment().diff(moment(date.toDate()), 'months') < periodLength)
}

const getInterval = (
  eventList: firebase.firestore.Timestamp[]
): number | null => {
  if (eventList.length < 2) {
    return null
  }
  const numIntervals = eventList.length - 1
  let totalDays = 0
  eventList.forEach((date, index) => {
    if (index > 0) {
      totalDays += moment(eventList[index - 1].toDate()).diff(moment(date.toDate()), 'days')
    }
  })
  return Math.round(totalDays / numIntervals)
}

export const getIntervals = (eventList: firebase.firestore.Timestamp[]): IntervalMap => {
  const periods = [1, 2, 3, 6, 12, Infinity]
  const intervalMap: IntervalMap = {}
  periods.forEach(period => {
    const truncatedList = getEventList(eventList, period)
    intervalMap[period] = getInterval(truncatedList)
  })
  return intervalMap
}
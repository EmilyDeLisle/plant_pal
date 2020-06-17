import * as functions from 'firebase-functions'
import * as moment from 'moment'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

interface IntervalMap {
  [key: number]: number | null
}

const getEventList = (events: string[], periodLength: number = 3): string[] => {
  return events.filter((date) => moment().diff(date, 'months') < periodLength)
}

const getInterval = (events: string[]): number | null => {
  if (events.length > 1) {
    const numIntervals = events.length - 1
    let totalDays = 0
    events.forEach((date, index) => {
      if (index > 0) {
        totalDays += moment(events[index - 1]).diff(moment(date), 'days')
      }
    })
    return Math.round(totalDays / numIntervals)
  } else {
    return null
  }
}

const getIntervals = (events: string[]): IntervalMap => {
  const periods = [1, 2, 3, 6, 12, Infinity]
  const intervals: IntervalMap = {}
  periods.forEach((period) => {
    intervals[period] = getInterval(getEventList(events, period))
  })
  return intervals
}

export const calculateIntervals = functions.firestore
  .document('users/{userID}/plants/{plantID}')
  .onWrite((change, context) => {
    const oldPlantData = change.before.data()
    const newPlantData = change.after.data()
    if (!!oldPlantData && !!newPlantData) {
      if (oldPlantData.wateringDates !== newPlantData.wateringDates) {
        return change.after.ref.update({
          wateringIntervals: getIntervals(newPlantData.wateringDates),
        })
      }
      if (oldPlantData.fertilizingDates !== newPlantData.fertilizingDates) {
        return change.after.ref.update({
          fertilizingIntervals: getIntervals(newPlantData.wateringDates),
        })
      }
      return null
    } else {
      return null
    }
  })

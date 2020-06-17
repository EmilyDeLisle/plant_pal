import * as functions from 'firebase-functions'
import { getIntervals } from './intervalHelpers'
import { compareDate } from './functionHelpers'

export const updateFertilizingStatus = functions.firestore
.document('users/{userID}/plants/{plantID}')
.onWrite((change) => {
  const oldPlantData = change.before.data()
  const newPlantData = change.after.data()
  if (
    !!oldPlantData &&
    !!newPlantData &&
    oldPlantData.fertilizingDates !== newPlantData.fertilizingDates
  ) {
    const newDates = newPlantData.fertilizingDates.sort(compareDate)
    const intervals = getIntervals(newDates)
    return change.after.ref.update({
      fertilizingDates: newDates,
      fertilizingIntervals: intervals,
      lastFertilizingDate: !!newDates && !!newDates.length ? newDates[0] : null,
    })
  } else {
    return null
  }
})

export const updateWateringStatus = functions.firestore
.document('users/{userID}/plants/{plantID}')
.onWrite((change) => {
  const oldPlantData = change.before.data()
  const newPlantData = change.after.data()
  if (
    !!oldPlantData &&
    !!newPlantData &&
    oldPlantData.wateringDates !== newPlantData.wateringDates
  ) {
    const newDates = newPlantData.wateringDates.sort(compareDate)
    const intervals = getIntervals(newDates)
    return change.after.ref.update({
      wateringDates: newDates,
      wateringIntervals: intervals,
      lastWateringDate: !!newDates && !!newDates.length ? newDates[0] : null,
    })
  } else {
    return null
  }
})

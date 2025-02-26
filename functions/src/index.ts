import * as functions from 'firebase-functions'
import { compareDate } from './functionHelpers'
import { getIntervals } from './intervalHelpers'

export const updateFertilizingStatus = functions.firestore
  .document('users/{userID}/plants/{plantID}')
  .onWrite((change) => {
    const oldPlantData = change.before.data()
    const newPlantData = change.after.data()
    if (
      (!!oldPlantData &&
      !!newPlantData &&
      oldPlantData.fertilizingDates !== newPlantData.fertilizingDates
    ) || (!oldPlantData && !!newPlantData)) {
      const newDates = newPlantData.fertilizingDates.sort(compareDate)
      return change.after.ref.update({
        fertilizingDates: newDates,
        fertilizingIntervals: getIntervals(newDates),
        lastFertilizedDate: !!newDates.length ? newDates[0] : null
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
      (!!oldPlantData &&
      !!newPlantData &&
      oldPlantData.wateringDates !== newPlantData.wateringDates
    ) || (!oldPlantData && !!newPlantData)) {
      const newDates = newPlantData.wateringDates.sort(compareDate)
      return change.after.ref.update({
        lastWateredDate: !!newDates.length ? newDates[0] : null,
        wateringDates: newDates,
        wateringIntervals: getIntervals(newDates),
      })
    } else {
      return null
    }
  })

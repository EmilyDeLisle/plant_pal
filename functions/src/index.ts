import * as functions from 'firebase-functions'
import { compareDate } from './functionHelpers'
import { getIntervals } from './intervalHelpers'

export const addID = functions.firestore
  .document('users/{userID}/plants/{plantID}')
  .onCreate((doc) => {
    return doc.ref.update({ id: doc.id })
  })

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
      !!oldPlantData &&
      !!newPlantData &&
      oldPlantData.wateringDates !== newPlantData.wateringDates
    ) {
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

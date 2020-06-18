import * as functions from 'firebase-functions'
import { compareDate } from './functionHelpers'

export const addID = functions.firestore
  .document('users/{userID}/plants/{plantID}')
  .onCreate((doc) => {
    return doc.ref.update({ id: doc.id })
  })

export const sortFertilizingDates = functions.firestore
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
        fertilizingDates: newDates
      })
    } else {
      return null
    }
  })

export const sortWateringDates = functions.firestore
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
        wateringDates: newDates,
      })
    } else {
      return null
    }
  })

import * as moment from 'moment'
import { firestore } from 'firebase'

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

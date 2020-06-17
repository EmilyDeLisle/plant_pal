import * as moment from 'moment'
import { firestore } from 'firebase'

export const compareDate = (
  a: firestore.Timestamp | null,
  b: firestore.Timestamp | null
): number => {
  const dateA = !!a && moment(a.toDate())
  const dateB = !!b && moment(b.toDate())
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
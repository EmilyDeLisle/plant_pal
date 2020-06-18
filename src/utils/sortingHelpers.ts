import moment from 'moment'
import { firestore } from 'firebase'
import { Plant, PlantEventType, SortingMode, SortingDirection } from '../models'

/**
 * Comparator function for comparing plant names or interval values
 * @param a string, integer, or undefined (name or interval value)
 * @param b string, integer, or undefined (name or interval value)
 * @return ordering value (-1, 0, or 1)
 */
export const compare = (a: string | number | null, b: string | number | null): number => {
  // if one value is undefined but the other is not, place the undefined value first
  if (!b && !!a) {
    return -1
  }
  if (!a && !!b) {
    return 1
  }
  if (!!a && !!b) {
    if (b < a) {
      return -1
    }
    if (b > a) {
      return 1
    }
  }
  return 0
}

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
    if (dateA.isSame(dateB, 'date')) {
      return 0
    }
  }
  return 0
}

/**
 * Gets the appropriate comparator function depending on the specified SortingMode
 * @param a Plant
 * @param b Plant
 * @param orderBy SortingMode enum
 * @return ordering value (-1, 0, or 1)
 */
export const descendingComparator = (a: Plant, b: Plant, orderBy: SortingMode): number => {
  let compareValue
  switch (orderBy) {
    case SortingMode.FERTILIZE:
      compareValue = compareDate(a.lastFertilizedDate, b.lastFertilizedDate)
      break
    case SortingMode.INTERVAL:
      compareValue = compare(a.wateringIntervals[3], b.wateringIntervals[3])
      break
    default:
      compareValue = compareDate(a.lastWateredDate, b.lastWateredDate)
  }
  // if the SortingMode is not 'name' and the compare value is something other than 0, sort by the specified
  // SortingMode, otherwise sort by name
  return orderBy !== SortingMode.NAME && compareValue !== 0 ? compareValue : compare(a.name, b.name)
}

/**
 * Gets the appropriate function in the specified SortingDirection
 * @param order SortingDirection
 * @param orderBy SortingMode
 * @return comparator function
 */
export const getComparator = (
  order: SortingDirection,
  orderBy: SortingMode
): ((a: Plant, b: Plant) => number) =>
  order === SortingDirection.DESC
    ? (a: Plant, b: Plant) => descendingComparator(a, b, orderBy)
    : (a: Plant, b: Plant) => -descendingComparator(a, b, orderBy)

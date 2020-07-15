import moment from 'moment'
import { firestore } from 'firebase'
import { Plant, PlantEventType, SortingMode, SortingDirection } from '../models'

/**
 * Returns true if a value is null or undefined, but false if it is a string or number, including '' and 0
 * @param value string, number, undefined, or null
 */
export const isNullOrUndefined = (value: string | number | undefined | null) =>
  value === null || value === undefined

/**
 * Comparator function for comparing plant names, days to water, or interval values
 * @param a string, number, undefined, or null
 * @param b string, number, undefined, or null
 * @return ordering value (-1, 0, or 1)
 */
export const compare = (
  a: string | number | undefined | null,
  b: string | number | undefined | null
): number => {
  // if one value is null/undefined but the other is not, place the undefined value first
  if (isNullOrUndefined(b) && !isNullOrUndefined(a)) {
    return -1
  }
  if (isNullOrUndefined(a) && !isNullOrUndefined(b)) {
    return 1
  }

  if (!isNullOrUndefined(a) && !isNullOrUndefined(b)) {
    // converts strings to lowercase values so upper/lowercase are sorted as the same value
    const valueA = typeof a === 'string' ? a.toLowerCase() : a
    const valueB = typeof b === 'string' ? b.toLowerCase() : b
    if (valueB! < valueA!) {
      return -1
    }
    if (valueB! > valueA!) {
      return 1
    }
  }
  return 0
}

/**
 * Comparator function for date (Timestamp) objects
 * @param a Timestamp or null
 * @param b Timestamp or null
 */
export const compareDate = (
  a: firestore.Timestamp | null,
  b: firestore.Timestamp | null
): number => {
  // if one value is undefined but the other is not, place the undefined value first
  if (!b && !!a) {
    return -1
  }
  if (!a && !!b) {
    return 1
  }

  if (!!a && !!b) {
    const dateA = moment(a.toDate())
    const dateB = moment(b.toDate())
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
    case SortingMode.DAYS_TO_WATER:
      compareValue = compare(a.daysToWater, b.daysToWater)
      break
    case SortingMode.FERTILIZE:
      compareValue = compareDate(a.lastFertilizedDate, b.lastFertilizedDate)
      break
    case SortingMode.INTERVAL:
      compareValue = compare(
        a.getAvgInterval(PlantEventType.WATER),
        b.getAvgInterval(PlantEventType.WATER)
      )
      break
    default:
      compareValue = compareDate(a.lastWateredDate, b.lastWateredDate)
  }
  /* if the SortingMode is not 'name' and the compare value is something other than 0, sort by the specified SortingMode, otherwise sort by name */
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

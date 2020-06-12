import moment from 'moment'
import { Plant, PlantEventType, SortingMode, SortingDirection } from '../models'

/**
 * Comparator function for comparing plant names or interval values
 * @param a string, integer, or undefined (name or interval value)
 * @param b string, integer, or undefined (name or interval value)
 * @return ordering value (-1, 0, or 1)
 */
export const compare = (a: string | number | undefined, b: string | number | undefined): number => {
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

/**
 * Comparator functions for comparing date values
 * @param a string or undefined (UTC date string)
 * @param b string or undefined (UTC date string)
 * @return ordering value (-1, 0, or 1)
 */
export const compareDate = (a: string | undefined, b: string | undefined): number => {
  const mostRecentDateA = !!a ? moment(a) : undefined
  const mostRecentDateB = !!b ? moment(b) : undefined
  // if one value is undefined but the other is not, place the undefined value first
  if (!mostRecentDateB && !!mostRecentDateA) {
    return -1
  }
  if (!mostRecentDateA && !!mostRecentDateB) {
    return 1
  }

  if (!!mostRecentDateA && !!mostRecentDateB) {
    if (mostRecentDateB.isBefore(mostRecentDateA, 'day')) {
      return -1
    }
    if (mostRecentDateB.isAfter(mostRecentDateB, 'day')) {
      return 1
    }
    if (mostRecentDateB.isSame(mostRecentDateB, 'day')) {
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
      compareValue = compare(
        a.getAvgInterval(PlantEventType.WATER),
        b.getAvgInterval(PlantEventType.WATER)
      )
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

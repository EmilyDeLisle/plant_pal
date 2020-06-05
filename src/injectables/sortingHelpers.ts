import moment from 'moment'
import { Plant, SortingMode, SortingDirection } from '../models'

const compare = (a: string | number | undefined, b: string | number | undefined): number => {
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

const compareDateList = (a: string[] | undefined, b: string[] | undefined): number => {
  const mostRecentDateA = !!a && a.length > 0 ? moment(a[0]) : undefined
  const mostRecentDateB = !!b && b.length > 0 ? moment(b[0]) : undefined
  // if one value is undefined but the other is not, place the undefined value first
  if (!mostRecentDateB && !!mostRecentDateA) {
    return 1
  }
  if (!mostRecentDateA && !!mostRecentDateB) {
    return -1
  }

  if (!!mostRecentDateA && !!mostRecentDateB) {
    if (mostRecentDateB < mostRecentDateA) {
      return -1
    }
    if (mostRecentDateA < mostRecentDateB) {
      return 1
    }
  }
  return 0
}

const descendingComparator = (a: Plant, b: Plant, orderBy: SortingMode): number => {
  switch (orderBy) {
    case SortingMode.WATER:
      return compareDateList(a.wateringDates, b.wateringDates)
    case SortingMode.FERTILIZE:
      return compareDateList(a.fertilizingDates, b.fertilizingDates)
    case SortingMode.INTERVAL:
      return compare(a.getAvgWateringInterval(), b.getAvgWateringInterval())
    default:
      return compare(a.name, b.name)
  }
}

export const getComparator = (order: SortingDirection, orderBy: SortingMode) => {
  return order === SortingDirection.DESC
    ? (a: Plant, b: Plant) => descendingComparator(a, b, orderBy)
    : (a: Plant, b: Plant) => -descendingComparator(a, b, orderBy)
}

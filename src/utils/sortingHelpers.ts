import moment from 'moment'
import { Plant, PlantEventType, SortingMode, SortingDirection } from '../models'

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

export const compareDate = (a: string | undefined, b: string | undefined): number => {
  const mostRecentDateA = !!a ? moment(a) : undefined
  const mostRecentDateB = !!b ? moment(b) : undefined
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

export const descendingComparator = (a: Plant, b: Plant, orderBy: SortingMode): number => {
  switch (orderBy) {
    case SortingMode.WATER:
      return compareDate(a.lastWateredDate, b.lastWateredDate)
    case SortingMode.FERTILIZE:
      return compareDate(a.lastFertilizedDate, b.lastFertilizedDate)
    case SortingMode.INTERVAL:
      return compare(a.getAvgInterval(PlantEventType.WATER), b.getAvgInterval(PlantEventType.WATER))
    default:
      return compare(a.name, b.name)
  }
}

export const getComparator = (order: SortingDirection, orderBy: SortingMode) => {
  return order === SortingDirection.DESC
    ? (a: Plant, b: Plant) => descendingComparator(a, b, orderBy)
    : (a: Plant, b: Plant) => -descendingComparator(a, b, orderBy)
}

import moment from 'moment'
import { Plant, SortingMode, SortingDirection } from '../models'

const compareName = (a: string, b: string): number => {
  if (b < a) {
    return -1
  }
  if (b > a) {
    return 1
  }
  return 0
}

const compareDateList = (a: string[] | undefined, b: string[] | undefined): number => {
  const mostRecentDateA = !!a && a.length > 0 ? moment(a[0]) : undefined
  const mostRecentDateB = !!b && b.length > 0 ? moment(b[0]) : undefined

  if (!mostRecentDateA && !mostRecentDateB) {
    return 0
  }
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
  const sortingPropertyA = a[orderBy]
  const sortingPropertyB = b[orderBy]
  switch (orderBy) {
    case SortingMode.WATER:
    case SortingMode.FERTILIZE:
      return compareDateList(sortingPropertyA, sortingPropertyB)
    case SortingMode.INTERVAL:
      return 0
    default:
      return compareName(sortingPropertyA, sortingPropertyB)
  }
}

export const getComparator = (order: SortingDirection, orderBy: SortingMode) => {
  return order === SortingDirection.DESC
    ? (a: Plant, b: Plant) => descendingComparator(a, b, orderBy)
    : (a: Plant, b: Plant) => -descendingComparator(a, b, orderBy)
}

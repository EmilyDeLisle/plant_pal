import moment, { Moment } from 'moment'
import { firestore } from 'firebase'

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow at] LT',
    lastWeek: '[last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'L',
  }
})

export const calculateDays = (date: Moment): number => {
  const today = moment()
  return Math.round(today.diff(date, 'hours') / 24)
}

export const formatDays = (date: firestore.Timestamp): string => {
  const newDate = moment(date.toDate())
  return calculateDays(newDate) < 2 ? newDate.calendar() : newDate.fromNow()
}

export const formatDate = (date: firestore.Timestamp | null): string => {
  if (!date) {
    return 'Never'
  } else {
    const newDate = moment(date.toDate())
    return `${newDate.format('MMM D, YYYY')} (${formatDays(date)})`
  }
}

import moment, { Moment } from 'moment'
import { firestore } from 'firebase/app'
import { HOURS_IN_DAY } from '../models'

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

export const isToday = (date: Moment | null): boolean => {
  return moment().isSame(date, 'date')
}

export const isDateUnavailable = (newEvent: firestore.Timestamp, eventList: firestore.Timestamp[]): boolean => {
  let isUnavailable = false
  eventList.forEach(event => {
    if (moment(newEvent.toDate()).isSame(event.toDate(), 'date')) {
      isUnavailable = true
    }
  })
  return isUnavailable
}

export const calculateDays = (date: Moment): number => {
  const today = moment()
  return Math.round(today.diff(date, 'hours') / HOURS_IN_DAY)
}

export const formatDays = (date: firestore.Timestamp): string => {
  const newDate = moment(date.toDate())
  return calculateDays(newDate) < 2 ? newDate.calendar() : newDate.fromNow()
}

export const formatDate = (date: firestore.Timestamp | null): string => {
  if (!date) {
    return 'Never'
  } else {
    return `${moment(date.toDate()).format('MMM D, YYYY')} (${formatDays(date)})`
  }
}

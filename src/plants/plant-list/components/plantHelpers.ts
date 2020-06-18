import moment, { Moment } from 'moment'
import { firestore } from 'firebase'

moment.locale('en', {
  calendar : {
      lastDay : '[Yesterday]',
      sameDay : '[Today]',
      nextDay : '[Tomorrow at] LT',
      lastWeek : '[last] dddd [at] LT',
      nextWeek : 'dddd [at] LT',
      sameElse : 'L'
  }
});

export const formatDate = (date: Moment | null): string => {
  const today = moment()
  if (!date) {
    return 'Never'
  } else {
    return `${date.format('MMM D, YYYY')} (${
      today.diff(date, 'days') < 2 ? date.calendar() : date.fromNow()
    })`
  }
}

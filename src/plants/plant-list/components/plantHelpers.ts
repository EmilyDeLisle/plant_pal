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

export const formatDate = (date: firestore.Timestamp | null): string => {
  const today = moment()
  
  if (!date) {
    return 'Never'
  } else {
    const newDate = moment(date.toDate())
    return `${newDate.format('MMM D, YYYY')} (${
      today.diff(newDate, 'days') < 2 ? newDate.calendar() : newDate.fromNow()
    })`
  }
}

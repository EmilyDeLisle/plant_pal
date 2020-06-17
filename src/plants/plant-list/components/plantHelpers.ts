import moment from 'moment'
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

export const formatDate = (dateString: firestore.Timestamp | null): string => {
  const today = moment()
  if (!dateString) {
    return 'Never'
  } else {
    const date = moment(dateString.toDate())
    return `${date.format('MMM D, YYYY')} (${
      today.diff(date, 'days') < 2 ? date.calendar() : date.fromNow()
    })`
  }
}

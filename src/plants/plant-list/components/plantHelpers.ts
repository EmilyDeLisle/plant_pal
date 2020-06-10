import moment from 'moment'

export const formatDate = (dateString: string | undefined): string => {
  const today = moment()
  if (!dateString) {
    return 'Never'
  } else {
    const date = moment(dateString)
    return `${date.format('MMM D, YYYY')} (${
      today.diff(date, 'days') < 2 ? date.calendar() : date.fromNow()
    })`
  }
}

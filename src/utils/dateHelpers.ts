import moment from 'moment'

export const isToday = (date: string): boolean => {
  return moment().isSame(moment(date), 'days')
}

import React, { useState } from 'react'
import moment, { Moment } from 'moment'
import { firestore } from 'firebase'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { DatePicker } from '@material-ui/pickers'
import { PlantEventType } from '../../../models'
import { getDatabase } from '../../../firebase'
import { isToday } from '../../../utils'

export interface EventSectionPickerProps {
  eventType: PlantEventType
  eventList: firestore.Timestamp[]
  plantID: string
}

export const EventSectionPicker = ({ eventType, eventList, plantID }: EventSectionPickerProps) => {
  const db = getDatabase()
  const action = eventType === PlantEventType.WATER ? 'Water' : 'Fertilize'
  const [dateMode, setDateMode] = React.useState('today')
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null)

  const checkEventExists = (newDate: Moment): boolean => {
    let disableDate = false
    eventList.forEach((date) => {
      if (!!date && newDate.isSame(moment(date.toDate()), 'date')) {
        disableDate = true
      }
    })
    return disableDate
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateMode((event.target as HTMLInputElement).value)
  }

  const handleModifyPlant = () => {
    console.log('Updating plant...')
    const date =
      dateMode === 'today' || moment().diff(selectedDate, 'days') < 1
        ? undefined
        : selectedDate?.set({ h: 12, m: 0 })
    db.modifyPlant(plantID, eventType, date, eventList, () => console.log('Plant updated'))
    setDateMode('today')
    setSelectedDate(null)
  }

  return (
    <div className="event-section-picker__container">
      <Button
        color="primary"
        variant="contained"
        onClick={() => handleModifyPlant()}
      >{`${action} plant`}</Button>
      <div className="event-section-picker__radio-group">
        <FormControl component="fieldset">
          <RadioGroup name="gender1" value={dateMode} onChange={handleChange} row>
            <FormControlLabel value="today" control={<Radio />} label="Today" />
            <FormControlLabel value="another" control={<Radio />} label="Another day" />
          </RadioGroup>
        </FormControl>
      </div>
      {dateMode === 'another' && (
        <div className="event-section-picker__picker">
          <DatePicker
            disableFuture
            variant="inline"
            label="Pick a date"
            format="MMM D, YYYY"
            value={selectedDate}
            onChange={setSelectedDate}
            animateYearScrolling
            shouldDisableDate={(date: Moment | null) => {
              return !!date && (checkEventExists(date) || isToday(date.format()))
            }}
          />
        </div>
      )}
    </div>
  )
}

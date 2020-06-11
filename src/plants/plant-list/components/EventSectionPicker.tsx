import React, { useRef, useState } from 'react'
import moment, { Moment } from 'moment'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import { DatePicker } from '@material-ui/pickers'
import { PlantEventType } from '../../../models'

export interface EventButtonProps {
  eventType: PlantEventType
  modifyPlant: (eventType: PlantEventType, date?: string) => void
}

export const EventSectionPicker = ({ eventType, modifyPlant }: EventButtonProps) => {
  const action = eventType === PlantEventType.WATER ? 'Water' : 'Fertilize'
  const [value, setValue] = React.useState('today')
  const [selectedDate, handleDateChange] = useState<Moment | null>(moment())

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  const handleModifyPlant = () => {
    const today = moment()
    const date =
      value === 'today' || today.diff(selectedDate, 'days') < 1
        ? today
        : selectedDate?.set({ h: 12, m: 0 })
    modifyPlant(eventType, date?.utc().format())
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
          <RadioGroup name="gender1" value={value} onChange={handleChange} row>
            <FormControlLabel value="today" control={<Radio />} label="Today" />
            <FormControlLabel value="another" control={<Radio />} label="Another day" />
          </RadioGroup>
        </FormControl>
      </div>
      {value === 'another' && (
        <div className="event-section-picker__picker">
          <DatePicker
            disableFuture
            format="MMM D, YYYY"
            value={selectedDate}
            onChange={handleDateChange}
            animateYearScrolling
          />
        </div>
      )}
    </div>
  )
}

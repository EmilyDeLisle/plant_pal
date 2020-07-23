import React, { useState } from 'react'
import moment, { Moment } from 'moment'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { DatePicker } from '@material-ui/pickers'
import { Plant, PlantEvent, PlantEventType } from '../models'
import { isToday } from '../utils'

export interface EventSectionPickerProps {
  eventType: PlantEventType.WATER | PlantEventType.FERTILIZE
  plant: Plant
  handleModifyPlant: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
    plant: Plant,
    plantEvent: PlantEvent
  ) => void
}

export const EventSectionPicker = ({
  eventType,
  plant,
  handleModifyPlant,
}: EventSectionPickerProps) => {
  const { name, getEventDateList } = plant
  const action = eventType === PlantEventType.WATER ? 'Water' : 'Fertilize'
  const verb = eventType === PlantEventType.WATER ? 'Water' : 'Fertiliz'
  const lowerCaseVerb = verb.toLowerCase()
  const eventList = getEventDateList(eventType)
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

  const handlePlantEvent = (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>
  ) => {
    const date =
      dateMode === 'today' || moment().diff(selectedDate, 'days') < 1
        ? undefined
        : selectedDate?.set({ h: 12, m: 0 })
    handleModifyPlant(event, plant, {
      eventType,
      date,
      initialMessage: `${verb}ing ${name}...`,
      successMessage: `${name} successfully ${lowerCaseVerb}ed`,
      duplicateMessage: `${name} already ${lowerCaseVerb}ed ${!!date ? 'this date' : 'today'}`,
      errorMessage: `There was an error while ${lowerCaseVerb}ing ${name}`,
    })
    setDateMode('today')
    setSelectedDate(null)
  }

  return (
    <div className="event-section-picker__container">
      <Button
        color="primary"
        variant="contained"
        disabled={!selectedDate && dateMode === 'another'}
        onClick={(event) => handlePlantEvent(event)}
      >{`${action} plant`}</Button>
      <div className="event-section-picker__radio-group">
        <FormControl component="fieldset">
          <RadioGroup name="todayOrNot" value={dateMode} onChange={handleChange} row>
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
              return !!date && (checkEventExists(date) || isToday(date))
            }}
          />
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { Plant, PlantEventType } from '../../../models'
import { formatDate } from './plantHelpers'

export interface EventSectionProps {
  plantID: string
  eventType: PlantEventType.WATER | PlantEventType.FERTILIZE
  lastEventDate: string | undefined
  eventDates: string[]
  modifyPlant: (plantID: string, eventType: PlantEventType, date?: string) => void
  getAvgWateringInterval?: (period?: number) => number | undefined
}

const periodOptions = [
  { value: 1, label: 'Last month' },
  { value: 2, label: 'Last 2 months' },
  { value: 3, label: 'Last 3 months' },
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last year' },
  { value: Infinity, label: 'All time' },
]

export const EventSection = ({
  plantID,
  eventType,
  lastEventDate,
  eventDates,
  modifyPlant,
  getAvgWateringInterval,
}: EventSectionProps) => {
  const action = eventType === PlantEventType.FERTILIZE ? 'Fertilizer' : 'Water'
  const [period, setPeriod] = useState(3)
  const avgWateringInterval = !!getAvgWateringInterval ? getAvgWateringInterval(period) : undefined

  return (
    <div className="event-section__container">
      <Card>
        <div className="event-section__contents">
          <div className="event-section__row">
            <Typography variant="h5">
              {action}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={() => modifyPlant(plantID, eventType)}
            >{`${action} plant today`}</Button>
          </div>
          {eventType === PlantEventType.WATER && !!avgWateringInterval && (
            <div className="event-section__row event-section__body">
              <Typography display="inline">
                {`Watered (on average) every ${avgWateringInterval} day${
                  avgWateringInterval !== 1 && 's'
                } `}
              </Typography>
              <Select
                value={period}
                onChange={({ target: { value } }) => setPeriod(value as number)}
              >
                {periodOptions.map((opt) => (
                  <MenuItem value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </div>
          )}
          <Typography>{`Last ${
            eventType === PlantEventType.FERTILIZE ? 'fertilized' : 'watered'
          }: ${formatDate(lastEventDate)}`}</Typography>
          {!!eventDates.length && (
            <div className="event-section__dates">
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Dates</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div>
                    {eventDates.map((date) => (
                      <Typography variant="body2" color="textSecondary">
                        {moment(date).format('MMM D, YYYY')}
                      </Typography>
                    ))}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

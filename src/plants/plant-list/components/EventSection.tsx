import React, { useState } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Plant, PlantEventType } from '../../../models'
import { EventSectionPicker } from './EventSectionPicker'
import { formatDate } from './plantHelpers'

export interface EventSectionProps {
  eventType: PlantEventType.WATER | PlantEventType.FERTILIZE
  plant: Plant
}

const periodOptions = [
  { value: 1, label: 'Last month' },
  { value: 2, label: 'Last 2 months' },
  { value: 3, label: 'Last 3 months' },
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last year' },
  { value: Infinity, label: 'All time' },
]

export const EventSection = observer(({ eventType, plant }: EventSectionProps) => {
  const { getAvgInterval, getEventDateList, getLastEventDate } = plant
  const [period, setPeriod] = useState(3)
  const avgInterval = getAvgInterval(eventType, period)
  const eventList = getEventDateList(eventType, period)
  const lastEventDate = getLastEventDate(eventType)
  const isWater = eventType === PlantEventType.WATER

  return (
    <div className="event-section__container">
      <Card>
        <div className="event-section__contents">
          <div className="event-section__row">
            <Typography variant="h5">{isWater ? 'Water' : 'Fertilizer'}</Typography>
          </div>
          <div className="event-section__row">
            <EventSectionPicker eventType={eventType} plant={plant} />
          </div>
          <div className="event-section__dates">
            <Divider />
          </div>

          <div className="event-section__row event-section__body">
            {!!avgInterval ? (
              <Typography display="inline">
                {`${isWater ? 'Watered' : 'Fertilized'} (on average) every ${avgInterval} day${
                  avgInterval !== 1 && 's'
                } `}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                <em>{`Need at least two ${
                  isWater ? 'watering' : 'fertilizing'
                } events to calculate average interval`}</em>
              </Typography>
            )}
            <Select value={period} onChange={({ target: { value } }) => setPeriod(value as number)}>
              {periodOptions.map((opt) => (
                <MenuItem
                  key={`${isWater ? 'watering' : 'fertilizing'}-interval-${opt.value}`}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Typography>{`Last ${
            eventType === PlantEventType.FERTILIZE ? 'fertilized' : 'watered'
          }: ${formatDate(lastEventDate)}`}</Typography>
          {!!eventList.length && (
            <div className="event-section__dates">
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{`${isWater ? 'Watering' : 'Fertilizing'} events (${
                    eventList.length
                  })`}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="event-section__date-list">
                    {eventList.map((date) => (
                      <div
                        key={`${isWater ? 'watering' : 'fertilizing'}-interval-${date.toMillis()}`}
                        className="event-section__date"
                      >
                        <Typography variant="body2" color="textSecondary">
                          {moment(date.toDate()).format('MMM D, YYYY')}
                        </Typography>
                        <Tooltip
                          title={`Delete this ${isWater ? 'watering' : 'fertilizing'} event`}
                          placement="left"
                        >
                          <IconButton size="small" color="default">
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
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
})

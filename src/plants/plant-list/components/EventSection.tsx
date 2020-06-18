import React, { useState } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { firestore } from 'firebase'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { IntervalMap, PlantEventType } from '../../../models'
import { EventSectionPicker } from './EventSectionPicker'
import { formatDate } from './plantHelpers'

export interface EventSectionProps {
  eventList: firestore.Timestamp[]
  eventType: PlantEventType.WATER | PlantEventType.FERTILIZE
  plantID: string
  intervals: IntervalMap
  lastEventDate: firestore.Timestamp | null
}

const periodOptions = [
  { value: 1, label: 'Last month' },
  { value: 2, label: 'Last 2 months' },
  { value: 3, label: 'Last 3 months' },
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last year' },
  { value: Infinity, label: 'All time' },
]

export const EventSection = observer(
  ({ eventType, eventList, plantID, intervals, lastEventDate }: EventSectionProps) => {
    const [period, setPeriod] = useState(3)
    const avgInterval = intervals[period]
    const isWater = eventType === PlantEventType.WATER

    return (
      <div className="event-section__container">
        <Card>
          <div className="event-section__contents">
            <div className="event-section__row">
              <Typography variant="h5">{isWater ? 'Water' : 'Fertilizer'}</Typography>
            </div>
            <div className="event-section__row">
              <EventSectionPicker eventList={eventList} eventType={eventType} plantID={plantID} />
            </div>
            <div className="event-section__dates">
              <Divider />
            </div>
            {!!avgInterval ? (
              <div className="event-section__row event-section__body">
                <Typography display="inline">
                  {`${isWater ? 'Watered' : 'Fertilized'} (on average) every ${avgInterval} day${
                    avgInterval !== 1 && 's'
                  } `}
                </Typography>
                <Select
                  value={period}
                  onChange={({ target: { value } }) => setPeriod(value as number)}
                >
                  {periodOptions.map((opt) => (
                    <MenuItem
                      key={`${isWater ? 'watering' : 'fertilizing'}-interval-${opt}`}
                      value={opt.value}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ) : (
              <Typography variant="body2" color="textSecondary">
                <em>{`Need at least two ${
                  isWater ? 'watering' : 'fertilizing'
                } event dates to calculate average interval`}</em>
              </Typography>
            )}
            <Typography>{`Last ${isWater ? 'watered' : 'fertilized'}: ${formatDate(
              lastEventDate
            )}`}</Typography>
            {!!eventList.length && (
              <div className="event-section__dates">
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{`${isWater ? 'Watering' : 'Fertilizing'} events (${
                      eventList.length
                    })`}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div>
                      {eventList.map((date) => (
                        <Typography
                          key={`${
                            isWater ? 'watering' : 'fertilizing'
                          }-interval-${date.toMillis()}`}
                          variant="body2"
                          color="textSecondary"
                        >
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
)

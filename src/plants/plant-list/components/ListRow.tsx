import React, { ReactElement } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import moment, { Moment } from 'moment'
import Button from '@material-ui/core/Button'
import { Plant, PlantEventType } from '../../../models'

interface ListRowProps {
  plant: Plant
  handleModifyPlant: (plantID: string, eventType: PlantEventType, date?: string) => void
}

export const ListRow = ({ plant, handleModifyPlant }: ListRowProps): ReactElement => {
  const {
    id,
    name,
    lastWateredDate,
    lastFertilizedDate,
    daysSinceLastFertilized,
    getAvgWateringInterval,
    toBeChecked,
  } = plant

  const avgWateringInterval = getAvgWateringInterval()

  return (
    <div className="plant-list-row-container">
      <Card>
        <div className="plant-list-row">
          <div>
            <Typography display="inline">{name}</Typography>
            {!!avgWateringInterval && (
              <Typography variant="body2" color="textSecondary" display="inline">
                {` - Watered every ${avgWateringInterval} day${avgWateringInterval !== 1 && 's'}`}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" display="inline">
              {` - Last watered: ${
                !!lastWateredDate
                  ? `${moment(lastWateredDate).format('MMM D, YYYY')} (${moment(
                      lastWateredDate
                    ).fromNow()})`
                  : 'Never'
              }`}
            </Typography>
            <Typography variant="body2" color="textSecondary" display="inline">
              {` - Last fertilized: ${
                !!lastFertilizedDate
                  ? `${moment(lastFertilizedDate).format('MMM D, YYYY')} (${moment(
                      lastFertilizedDate
                    ).fromNow()})`
                  : 'Never'
              }`}
            </Typography>
          </div>
          <div className="plant-list-row__buttons">
            {toBeChecked && (
              <Button onClick={() => handleModifyPlant(id, PlantEventType.CHECK)}>Check</Button>
            )}
            <Button onClick={() => handleModifyPlant(id, PlantEventType.WATER)}>Water</Button>
            <Button onClick={() => handleModifyPlant(id, PlantEventType.FERTILIZE)}>
              Fertilize
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

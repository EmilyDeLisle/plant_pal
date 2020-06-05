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
  const { id, name, lastWateredDate, lastFertilizedDate, getAvgWateringInterval } = plant

  const formatDate = (dateString: string | undefined): string => {
    return !!dateString ? moment(dateString).format('MMM D, YYYY') : 'Never'
  }

  return (
    <Card>
      <div className="plant-list-row">
        <Typography>{`ID: ${id} | Name: ${name} | Last watered: ${formatDate(
          lastWateredDate
        )} | Last fertilized: ${formatDate(
          lastFertilizedDate
        )} | Avg watering interval: ${getAvgWateringInterval()} days`}</Typography>
        <div className="plant-list-row__buttons">
          <Button onClick={() => handleModifyPlant(id, PlantEventType.WATER)}>Water</Button>
          <Button onClick={() => handleModifyPlant(id, PlantEventType.FERTILIZE)}>Fertilize</Button>
        </div>
      </div>
    </Card>
  )
}

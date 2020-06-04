import React, { ReactElement } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Plant } from '../../../models'

interface ListRowProps {
  plant: Plant
}

export const ListRow = ({ plant }: ListRowProps): ReactElement => {
  const { id, name, daysSinceLastWatered, daysSinceLastFertilized } = plant

  return (
    <Card>
      <div className="plant-list-row">
        <Typography>{`ID: ${id} | Name: ${name} | Last watered: ${
          !!daysSinceLastWatered ? `${daysSinceLastWatered} days ago` : 'Never'
        } | Last fertilized: ${
          !!daysSinceLastFertilized ? `${daysSinceLastFertilized} days ago` : 'Never'
        }`}</Typography>
        <div className="plant-list-row__buttons">
          <Button>Water</Button>
          <Button>Fertilize</Button>
        </div>
      </div>
    </Card>
  )
}

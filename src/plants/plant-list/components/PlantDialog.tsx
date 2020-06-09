import React, { useState } from 'react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Plant } from '../../../models'
import { formatDate } from './plantHelpers'

export interface PlantDialogProps {
  open: boolean
  handleClose: () => void
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

export const PlantDialog = ({ open, handleClose, plant }: PlantDialogProps) => {
  const {
    name,
    lastWateredDate,
    lastFertilizedDate,
    getAvgWateringInterval,
    wateringDates,
    fertilizingDates,
  } = plant
  const [period, setPeriod] = useState(3)
  const avgWateringInterval = getAvgWateringInterval(period)

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
        {avgWateringInterval && (
          <>
            <Typography display="inline">
              {`Watered every ${avgWateringInterval} day${avgWateringInterval !== 1 && 's'} `}
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={period}
              onChange={({ target: { value } }) => setPeriod(value as number)}
            >
              {periodOptions.map((opt) => (
                <MenuItem value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </>
        )}
        <Typography>{`Last watered: ${formatDate(lastWateredDate)}`}</Typography>
        {!!wateringDates.length && (
          <Typography variant="body2" color="textSecondary">
            Watering dates:
          </Typography>
        )}
        {wateringDates.map((date) => (
          <Typography variant="body2" color="textSecondary">
            {moment(date).format('MMM D, YYYY')}
          </Typography>
        ))}
        <Typography>{`Last fertilized: ${formatDate(lastFertilizedDate)}`}</Typography>
        {!!fertilizingDates.length && (
          <Typography variant="body2" color="textSecondary">
            Fertilizing dates:
          </Typography>
        )}
        {fertilizingDates.map((date) => (
          <Typography variant="body2" color="textSecondary">
            {moment(date).format('MMM D, YYYY')}
          </Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

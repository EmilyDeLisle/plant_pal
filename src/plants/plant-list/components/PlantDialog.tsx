import React, { useState } from 'react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Plant, PlantEventType } from '../../../models'
import { formatDate } from './plantHelpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      color: theme.palette.primary.contrastText,
    },
    titleText: {
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
    },
  })
)

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
  const classes = useStyles()
  const [period, setPeriod] = useState(3)
  const avgWateringInterval = getAvgWateringInterval(period)

  const renderEventsSection = (eventType: PlantEventType, lastEventDate: string | undefined) => {
    const title = eventType === PlantEventType.FERTILIZE ? 'Fertilizer' : 'Water'
    const action = eventType === PlantEventType.FERTILIZE ? 'fertilize' : 'water'

    return (
      <Card>
        <div className="plant-dialog-event-section__card">
          <div className="plant-dialog-event-section__row">
            <Typography variant="h5">{title}</Typography>
            <Button color='primary' variant="contained">{`${action} plant today`}</Button>
          </div>
          {eventType === PlantEventType.WATER && avgWateringInterval && (
            <div className="plant-dialog-event-section__row plant-dialog-event-section__body">
              <Typography display="inline">
                {`Watered (on average) every ${avgWateringInterval} day${
                  avgWateringInterval !== 1 && 's'
                } `}
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
            </div>
          )}
          <Typography>{`Last ${action}ed: ${formatDate(lastEventDate)}`}</Typography>
        </div>
      </Card>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div className={`${classes.titleCard} plant-dialog__title-card`}>
        <div className="plant-dialog__title-card-text">
          <Typography className={classes.titleText} variant="h4">
            {name}
          </Typography>
          <Typography className={classes.titleText}>Plant alternate name</Typography>
        </div>
        <div className="plant-dialog__title-card-close-button">
          <IconButton color="inherit" edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <DialogContent>
        {renderEventsSection(PlantEventType.WATER, lastWateredDate)}
        {/* <Typography variant="h5">Water</Typography>
        {avgWateringInterval && (
          <>
            <Typography display="inline">
              {`Watered (on average) every ${avgWateringInterval} day${
                avgWateringInterval !== 1 && 's'
              } `}
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
        )} */}
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
        <Typography variant="h5">Fertilizer</Typography>
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
        <Button color="primary">Action</Button>
      </DialogActions>
    </Dialog>
  )
}

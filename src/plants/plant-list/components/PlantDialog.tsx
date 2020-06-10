import React, { useState } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Plant, PlantEventType } from '../../../models'
import { EventSection } from './EventSection'

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
  modifyPlant: (plantID: string, eventType: PlantEventType, date?: string) => void
}

export const PlantDialog = ({ open, handleClose, plant, modifyPlant }: PlantDialogProps) => {
  const {
    id,
    name,
    lastWateredDate,
    lastFertilizedDate,
    getAvgWateringInterval,
    wateringDates,
    fertilizingDates,
  } = plant
  const classes = useStyles()

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
        <EventSection
          plantID={id}
          eventType={PlantEventType.WATER}
          lastEventDate={lastWateredDate}
          eventDates={wateringDates}
          getAvgWateringInterval={getAvgWateringInterval}
          modifyPlant={modifyPlant}
        />
        <EventSection
          plantID={id}
          eventType={PlantEventType.FERTILIZE}
          lastEventDate={lastFertilizedDate}
          eventDates={fertilizingDates}
          modifyPlant={modifyPlant}
        />
      </DialogContent>
    </Dialog>
  )
}

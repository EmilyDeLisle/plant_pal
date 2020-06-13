import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { Plant, PlantDialogMode, PlantEventType } from '../../../models'
import { EventSection } from './EventSection'

export interface PlantDialogContentProps {
  handleClose: () => void
  classes: any
}

export interface PlantDialogContentViewProps extends PlantDialogContentProps {
  plant: Plant
}

export const PlantDialogContentAdd = ({ handleClose, classes }: PlantDialogContentProps) => {
  return (
    <>
      <div className={`${classes.titleCard} plant-dialog__title-card`}>
        <div className="plant-dialog__title-card-text">
          <Typography className={classes.titleText} variant="h4">
            Add new plant
          </Typography>
        </div>
        <div className="plant-dialog__title-card-close-button">
          <IconButton color="inherit" edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <DialogContent>
        <Typography>Add new plant!</Typography>
      </DialogContent>
    </>
  )
}

export const PlantDialogContentView = ({
  plant,
  classes,
  handleClose,
}: PlantDialogContentViewProps) => {
  const { name } = plant

  return (
    <>
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
        <EventSection plant={plant} eventType={PlantEventType.WATER} />
        <EventSection plant={plant} eventType={PlantEventType.FERTILIZE} />
      </DialogContent>
    </>
  )
}

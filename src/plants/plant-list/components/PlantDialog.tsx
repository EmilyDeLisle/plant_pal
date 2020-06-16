import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Plant, PlantDialogMode } from '../../../models'
import { PlantDialogContentAdd, PlantDialogContentView } from './PlantDialogContent'

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
  plant?: Plant
  dialogMode: PlantDialogMode
}

export const PlantDialog = ({ open, handleClose, plant, dialogMode }: PlantDialogProps) => {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {dialogMode === PlantDialogMode.VIEW && !!plant ? (
        <PlantDialogContentView plant={plant} classes={classes} handleClose={handleClose} />
      ) : (
        <PlantDialogContentAdd classes={classes} handleClose={handleClose} />
      )}
    </Dialog>
  )
}

import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { Plant, PlantDialogMode } from '../../../models'
import { PlantDialogContentAdd, PlantDialogContentView } from './PlantDialogContent'

export interface PlantDialogProps {
  open: boolean
  handleClose: () => void
  plant?: Plant
  dialogMode: PlantDialogMode
}

export const PlantDialog = ({ open, handleClose, plant, dialogMode }: PlantDialogProps) => (
  <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
    {dialogMode === PlantDialogMode.VIEW && !!plant ? (
      <PlantDialogContentView plant={plant} handleClose={handleClose} />
    ) : (
      <PlantDialogContentAdd handleClose={handleClose} />
    )}
  </Dialog>
)

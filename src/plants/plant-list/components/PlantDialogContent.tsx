import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Moment } from 'moment'
import { DatePicker } from '@material-ui/pickers'
import { Plant, PlantEventType } from '../../../models'
import { plantStore } from '../../../injectables'
import { EventSection } from './EventSection'

export interface PlantDialogContentProps {
  handleClose: () => void
  classes: any
}

export interface PlantDialogContentViewProps extends PlantDialogContentProps {
  plant: Plant
}

interface FormValues {
  name: string
  altName: string
  lastWateredDate: Moment | null
  lastFertilizedDate: Moment | null
}

export const PlantDialogContentAdd = ({ handleClose, classes }: PlantDialogContentProps) => {
  const initialValues: FormValues = {
    name: '',
    altName: '',
    lastWateredDate: null,
    lastFertilizedDate: null,
  }
  const [values, setValues] = useState(initialValues)
  const [errorState, setErrorState] = useState(false)

  const handleChange = (name: string, value: string | Moment) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleSubmit = (values: FormValues) => {
    const { addPlant } = plantStore
    const randomID = String(Math.round(Math.random() * 1000))
    const { name, altName, lastWateredDate, lastFertilizedDate } = values
    if (!name) {
      setErrorState(true)
    } else {
      setErrorState(false)
      const wateredDate = lastWateredDate ? [lastWateredDate.utc().format()] : undefined
      const fertilizedDate = lastFertilizedDate ? [lastFertilizedDate.utc().format()] : undefined
      addPlant(new Plant(randomID, name, altName, wateredDate, fertilizedDate))
      handleClose()
      setValues(initialValues)
    }
  }

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
      <>
        <DialogContent>
          <TextField
            name="name"
            label="Display name"
            helperText="Name to search and sort by"
            error={errorState}
            value={values.name}
            onChange={({ target: { name, value } }) => handleChange(name, value)}
            required
            fullWidth
          />
          {errorState && <FormHelperText error={errorState}>Name is required</FormHelperText>}
          <TextField
            name="altName"
            label="Alternate name (optional)"
            helperText="Scientific name, nickname, unique identifier, etc"
            value={values.altName}
            onChange={({ target: { name, value } }) => handleChange(name, value)}
            fullWidth
          />
          <DatePicker
            disableFuture
            variant="inline"
            label="Last watered date (optional)"
            format="MMM D, YYYY"
            value={values.lastWateredDate}
            onChange={(date: Moment | null) => {
              !!date && handleChange('lastWateredDate', date)
            }}
            animateYearScrolling
            fullWidth
          />
          <DatePicker
            disableFuture
            variant="inline"
            label="Last fertilized date (optional)"
            format="MMM D, YYYY"
            value={values.lastFertilizedDate}
            onChange={(date: Moment | null) => {
              !!date && handleChange('lastFertilizedDate', date)
            }}
            animateYearScrolling
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleSubmit(values)}>
            Submit
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export const PlantDialogContentView = ({
  plant,
  classes,
  handleClose,
}: PlantDialogContentViewProps) => {
  const { name, altName } = plant

  return (
    <>
      <div className={`${classes.titleCard} plant-dialog__title-card`}>
        <div className="plant-dialog__title-card-text">
          <Typography className={classes.titleText} variant="h4">
            {name}
          </Typography>
          <Typography className={classes.titleText}>{altName}</Typography>
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

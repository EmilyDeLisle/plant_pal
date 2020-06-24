import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Moment } from 'moment'
import { firestore } from 'firebase'
import { DatePicker } from '@material-ui/pickers'
import { FormValues, Plant, PlantEventType, PlantProps } from '../../../models'
import { getDatabase, getStorage } from '../../../firebase'
import { EventSection } from './EventSection'

export interface PlantDialogContentProps {
  handleClose: () => void
  classes: any
}

export interface PlantDialogContentViewProps extends PlantDialogContentProps {
  plant: Plant
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
    const { name, altName, lastWateredDate, lastFertilizedDate } = values
    if (!name) {
      setErrorState(true)
    } else {
      setErrorState(false)
      const wateringDates = lastWateredDate
        ? [firestore.Timestamp.fromDate(lastWateredDate.toDate())]
        : []
      const fertilizingDates = lastFertilizedDate
        ? [firestore.Timestamp.fromDate(lastFertilizedDate.toDate())]
        : []
      const plant: PlantProps = { name, altName, wateringDates, fertilizingDates }
      const db = getDatabase()
      db.addPlant(plant, () => {
        console.log('Plant added successfully')
        handleClose()
        setValues(initialValues)
      })
    }
  }

  return (
    <>
      <div className={`${classes.titleCard} plant-dialog__title-card`}>
        <div className="plant-dialog-content__title-card-text">
          <Typography className={classes.titleText} variant="h4">
            Add new plant
          </Typography>
        </div>
        <div>
          <div className="plant-dialog-content__controls">
            <IconButton color="inherit" edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
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
  const { altName, name, id, imagePath } = plant
  const initialValues: FormValues = {
    name: name,
    altName: altName,
  }
  const [editMode, setEditMode] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [values, setValues] = useState(initialValues)
  const [errorState, setErrorState] = useState(false)
  const [imageURL, setImageURL] = useState<string | null>('')

  useEffect(() => {
    !!imagePath ? getStorage().getImage(imagePath, (url) => setImageURL(url)) : setImageURL(null)
  }, [])

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = (): void => {
    setAnchorEl(null)
  }

  const handleClickEdit = (): void => {
    setEditMode(true)
    handleCloseMenu()
  }

  const handleEndEdit = (): void => {
    setValues(initialValues)
    setEditMode(false)
  }

  const handleEditValues = (name: string, value: string | Moment): void => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleSubmitEdit = (values: FormValues): void => {
    const { name } = values
    if (!name) {
      setErrorState(true)
    } else {
      setErrorState(false)
      const db = getDatabase()
      db.updatePlantNames(id, values, () => {
        console.log('Plant successfully updated')
        handleEndEdit()
      })
    }
  }

  const handleDelete = (id: string): void => {
    if (window.confirm('Delete plant? This cannot be undone.')) {
      const db = getDatabase()
      db.deletePlant(id, () => console.log('Plant successfully deleted'))
    }
    handleCloseMenu()
    handleClose()
  }

  return imageURL === '' ? null : (
    <>
      <div
        className={`${classes.titleCard} plant-dialog__title-card`}
        style={{ backgroundImage: `url(${imageURL})` }}
      >
        <div className="plant-dialog-content__title-card-text">
          {editMode ? (
            <>
              <TextField
                name="name"
                label="Display name"
                helperText={errorState ? 'Name is required' : 'Name to search and sort by'}
                error={errorState}
                value={values.name}
                onChange={({ target: { name, value } }) => handleEditValues(name, value)}
                required
                fullWidth
              />
              <TextField
                name="altName"
                label="Alternate name (optional)"
                helperText="Scientific name, nickname, unique identifier, etc"
                value={values.altName}
                onChange={({ target: { name, value } }) => handleEditValues(name, value)}
                fullWidth
              />
              <Button onClick={handleEndEdit}>Cancel</Button>
              <Button onClick={() => handleSubmitEdit(values)}>Confirm Changes</Button>
            </>
          ) : (
            <>
              <Typography className={classes.titleText} variant="h4">
                {name}
              </Typography>
              <Typography className={classes.titleText}>{altName}</Typography>
            </>
          )}
        </div>
        <div>
          <div className="plant-dialog-content__controls">
            {!editMode && (
              <IconButton color="inherit" edge="end" onClick={handleClickMenu}>
                <MoreVertIcon />
              </IconButton>
            )}
            <IconButton color="inherit" edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClickEdit}>Edit plant</MenuItem>
              <MenuItem onClick={() => handleDelete(id)}>Delete plant</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <DialogContent>
        <EventSection eventType={PlantEventType.WATER} plant={plant} />
        <EventSection eventType={PlantEventType.FERTILIZE} plant={plant} />
      </DialogContent>
    </>
  )
}

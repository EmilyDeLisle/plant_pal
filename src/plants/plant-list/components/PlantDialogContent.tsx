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
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Moment } from 'moment'
import { firestore } from 'firebase'
import { DatePicker } from '@material-ui/pickers'
import { IFileWithMeta } from 'react-dropzone-uploader'
import { AddFormValues, FormValues, Plant, PlantEventType, PlantProps } from '../../../models'
import { getDatabase, getStorage } from '../../../firebase'
import { EventSection } from './EventSection'
import { ImageUpload } from './ImageUpload'

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

export interface PlantDialogContentProps {
  handleClose: () => void
}

export interface PlantDialogContentViewProps extends PlantDialogContentProps {
  plant: Plant
}

export const PlantDialogContentAdd = ({ handleClose }: PlantDialogContentProps) => {
  const initialValues: AddFormValues = {
    name: '',
    altName: '',
    lastWateredDate: null,
    lastFertilizedDate: null,
    fileName: '',
  }
  const [values, setValues] = useState(initialValues)
  const [errorState, setErrorState] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const classes = useStyles()

  // const [dates, setDates] = useState('')

  const handleChange = (name: string, value: string | Moment): void => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const handleSelectedImage = (imageFile: IFileWithMeta): void => {
    const {
      file,
      meta: { name, previewUrl },
    } = imageFile
    !!previewUrl && setImage(previewUrl)
    handleChange('fileName', name)
    setImageFile(file)
  }

  const handleSubmit = (values: AddFormValues): void => {
    const db = getDatabase()
    const storage = getStorage()
    const { name, altName, lastWateredDate, lastFertilizedDate, fileName } = values

    if (!name) {
      setErrorState(true)
    } else {
      setErrorState(false)
      // let wateringDates: firestore.Timestamp[] = []
      // let fertilizingDates: firestore.Timestamp[] = []
      // if (!!dates) {
      //   const datesArray = dates.split(', ')
      //   datesArray.forEach(date => {
      //     const end = date.length - 1
      //     const dateEnd = date.length - 2
      //     if (date.charAt(end) === 'F') {
      //       const dateString = date.substring(dateEnd, 0)
      //       wateringDates.push(firestore.Timestamp.fromDate(new Date(dateString)))
      //       fertilizingDates.push(firestore.Timestamp.fromDate(new Date(dateString)))
      //     } else {
      //       wateringDates.push(firestore.Timestamp.fromDate(new Date(date)))
      //     }
      //   })
      // } else {
        const wateringDates = !!lastWateredDate
          ? [firestore.Timestamp.fromDate(lastWateredDate.toDate())]
          : []
        const fertilizingDates = !!lastFertilizedDate
          ? [firestore.Timestamp.fromDate(lastFertilizedDate.toDate())]
          : []
      // }

      const plant: PlantProps = { name, altName, wateringDates, fertilizingDates }

      // add plant to db
      const plantID = db.addPlant(plant, fileName, () => {
        console.log('Plant added successfully')
        handleClose()
        setValues(initialValues)
      })

      // // add image file to storage
      !!fileName &&
        !!imageFile &&
        plantID &&
        storage.uploadImage(imageFile, plantID, (snapshot: firebase.storage.UploadTaskSnapshot) => {
          console.log('Image uploaded successfully')
        })
    }
  }

  return (
    <>
      <div
        className={`${classes.titleCard} plant-dialog__title-card ${
          image !== null ? 'plant-dialog-content--image-background' : ''
        }`}
        style={{ backgroundImage: image !== null ? `url(${image})` : '' }}
      >
        <div className="plant-dialog-content__title-card-top">
          <Typography className={classes.titleText} variant="h4">
            Add new plant
          </Typography>
          <div className="plant-dialog-content__controls">
            <IconButton color="inherit" edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <ImageUpload handleSelectedImage={handleSelectedImage} />
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
          {/* <TextField
            name="Dates"
            label="dates"
            value={dates}
            onChange={({ target: { value } }) => setDates(value)}
            fullWidth
            multiline
          /> */}
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

export const PlantDialogContentView = ({ plant, handleClose }: PlantDialogContentViewProps) => {
  const { altName, name, id, imageFileName } = plant
  const initialValues: FormValues = {
    name: name,
    altName: altName,
  }
  const [editMode, setEditMode] = useState<'names' | 'image' | ''>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [values, setValues] = useState(initialValues)
  const [errorState, setErrorState] = useState(false)
  const [imageURL, setImageURL] = useState<string | null>('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const classes = useStyles()

  useEffect(() => {
    !!imageFileName
      ? getStorage().getImage(id, imageFileName, (url: string) => setImageURL(url))
      : setImageURL(null)
  }, [])

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = (): void => {
    setAnchorEl(null)
  }

  const handleClickEdit = (mode: 'names' | 'image' | ''): void => {
    setEditMode(mode)
    handleCloseMenu()
  }

  const handleEndEditNames = (): void => {
    setValues(initialValues)
    setEditMode('')
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
        handleEndEditNames()
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

  const handleSelectedImage = (imageFile: IFileWithMeta): void => {
    const {
      file,
      meta: { previewUrl },
    } = imageFile
    !!previewUrl && setImageURL(previewUrl)
    setNewImageFile(file)
  }

  const handleUploadNewImage = () => {
    setEditMode('')
    const db = getDatabase()
    const storage = getStorage()
    if (!!newImageFile) {
      db.updatePlantImageFileName(id, newImageFile.name, () => {
        console.log('Image file name updated in db')
      })
      storage.uploadImage(newImageFile, id, (snapshot: firebase.storage.UploadTaskSnapshot) => {
        console.log('New image successfully uploaded')
        setEditMode('')
        !!imageFileName &&
          storage.deleteImage(id, imageFileName, () => {
            console.log('Old image successfully deleted')
          })
      })
    }
  }

  return imageURL === '' ? null : (
    <>
      <div
        className={`${classes.titleCard} plant-dialog__title-card`}
        style={imageURL !== null ? { backgroundImage: `url(${imageURL})` } : undefined}
      >
        <div className="plant-dialog-content__title-card-top">
          {editMode !== 'names' && (
            <div>
              <Typography className={classes.titleText} variant="h4">
                {name}
              </Typography>
              <Typography className={classes.titleText}>{altName}</Typography>
            </div>
          )}
          <div className="plant-dialog-content__controls">
            {editMode === '' && (
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
              <MenuItem onClick={() => handleClickEdit('names')}>Edit name</MenuItem>
              <MenuItem onClick={() => handleClickEdit('image')}>Change image</MenuItem>
              <MenuItem onClick={() => handleDelete(id)}>Delete plant</MenuItem>
            </Menu>
          </div>
        </div>
        {editMode === 'image' && (
          <>
            <ImageUpload onlyDropzone handleSelectedImage={handleSelectedImage} />
            <div>
              <Button color="inherit" onClick={() => setEditMode('')}>
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleUploadNewImage()}>
                Change image
              </Button>
            </div>
          </>
        )}
        {editMode === 'names' && (
          <div className="plant-dialog-content__edit-name-fields">
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
            <Button onClick={handleEndEditNames}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={() => handleSubmitEdit(values)}>
              Confirm Changes
            </Button>
          </div>
        )}
      </div>
      <DialogContent>
        <EventSection eventType={PlantEventType.WATER} plant={plant} />
        <EventSection eventType={PlantEventType.FERTILIZE} plant={plant} />
      </DialogContent>
    </>
  )
}

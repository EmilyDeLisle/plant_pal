import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
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

export interface InspectorPanelContentProps {
  handleClose: () => void
}

export interface InspectorPanelContentViewProps extends InspectorPanelContentProps {
  plant: Plant
}

export const InspectorPanelContentAdd = ({ handleClose }: InspectorPanelContentProps) => {
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
      const wateringDates = !!lastWateredDate
        ? [firestore.Timestamp.fromDate(lastWateredDate.toDate())]
        : []
      const fertilizingDates = !!lastFertilizedDate
        ? [firestore.Timestamp.fromDate(lastFertilizedDate.toDate())]
        : []

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
        className={`${classes.titleCard} inspector-panel__title-card ${
          image !== null ? 'inspector-panel-content--image-background' : ''
        }`}
        style={{ backgroundImage: image !== null ? `url(${image})` : '' }}
      >
        <div className="inspector-panel-content__title-card-top">
          <Typography className={classes.titleText} variant="h4">
            Add new plant
          </Typography>
          <div className="inspector-panel-content__controls">
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => {
                setImage('')
                handleClose()
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <ImageUpload handleSelectedImage={handleSelectedImage} />
      </div>
      <div className="inspector-panel-content__contents">
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
        <Button variant="contained" onClick={() => handleSubmit(values)}>
          Submit
        </Button>
      </div>
    </>
  )
}

export const InspectorPanelContentView = ({
  plant,
  handleClose,
}: InspectorPanelContentViewProps) => {
  const { altName, name, id, imageFileName, imageURL } = plant
  const initialValues: FormValues = {
    name: name,
    altName: altName,
  }
  const [editMode, setEditMode] = useState<'names' | 'image' | ''>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [values, setValues] = useState(initialValues)
  const [errorState, setErrorState] = useState(false)
  const [previewImageURL, setPreviewImageURL] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const classes = useStyles()

  useEffect(() => {
    setPreviewImageURL('')
    setEditMode('')
  }, [id])

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
    setPreviewImageURL('')
    handleClose()
  }

  const handleSelectedImage = (imageFile: IFileWithMeta): void => {
    const {
      file,
      meta: { previewUrl },
    } = imageFile
    !!previewUrl && setPreviewImageURL(previewUrl)
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

  const getImage = (): React.CSSProperties | undefined => {
    if (!!previewImageURL) {
      return { backgroundImage: `url(${previewImageURL})` }
    } else if (!!imageURL) {
      return { backgroundImage: `url(${imageURL})` }
    }
    return undefined
  }

  return (
    <>
      <div className={`${classes.titleCard} inspector-panel__title-card`} style={getImage()}>
        <div className="inspector-panel-content__title-card-top">
          {editMode !== 'names' && (
            <div>
              <Typography className={classes.titleText} variant="h4">
                {name}
              </Typography>
              <Typography className={classes.titleText}>{altName}</Typography>
            </div>
          )}
          <div className="inspector-panel-content__controls">
            {editMode === '' && (
              <IconButton color="inherit" edge="end" onClick={handleClickMenu}>
                <MoreVertIcon />
              </IconButton>
            )}
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => {
                setPreviewImageURL('')
                handleClose()
              }}
            >
              <CloseIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
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
              <Button
                color="inherit"
                onClick={() => {
                  setPreviewImageURL('')
                  setEditMode('')
                }}
              >
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleUploadNewImage()}>
                Change image
              </Button>
            </div>
          </>
        )}
        {editMode === 'names' && (
          <div className="inspector-panel-content__edit-name-fields">
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
      <div className="inspector-panel-content__contents">
        <EventSection eventType={PlantEventType.WATER} plant={plant} />
        <EventSection eventType={PlantEventType.FERTILIZE} plant={plant} />
      </div>
    </>
  )
}

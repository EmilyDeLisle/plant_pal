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
import { useSnackbar } from 'notistack'
import { firestore } from 'firebase'
import { DatePicker } from '@material-ui/pickers'
import { IFileWithMeta } from 'react-dropzone-uploader'
import {
  AddFormValues,
  FormValues,
  Plant,
  PlantEvent,
  PlantEventType,
  PlantProps,
} from '../../../models'
import { getDatabase, getStorage } from '../../../firebase'
import { EventSection } from './EventSection'
import { ImageUpload } from './ImageUpload'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      color: theme.palette.primary.contrastText,
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
    },
    titleText: {
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
    },
    controlIcon: {
      color: theme.palette.primary.contrastText,
      filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5))',
    },
  })
)

export interface InspectorPanelContentProps {
  handleClose: () => void
}

export interface InspectorPanelContentViewProps extends InspectorPanelContentProps {
  plant: Plant
  handleModifyPlant: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement>,
    plant: Plant,
    plantEvent: PlantEvent
  ) => void
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
  const { enqueueSnackbar } = useSnackbar()
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
      const plantID = db.addPlant(
        plant,
        () => {
          enqueueSnackbar(`${name} added successfully`, { variant: 'success' })
          setValues(initialValues)
          handleClose()
        },
        (error) => {
          enqueueSnackbar(`There was an error adding ${name}`, { variant: 'error' })
          console.log(error)
        }
      )

      // add image file to storage & update filename in db
      !!fileName &&
        !!imageFile &&
        plantID &&
        storage.uploadImage(imageFile, plantID, (snapshot: firebase.storage.UploadTaskSnapshot) => {
          console.log('Image uploaded successfully')
          // set new file name in the plant's document in firestore
          db.updatePlantImageFileName(plantID, fileName, () => {
            console.log('Image file name updated in db')
          })
        })
    }
  }

  return (
    <>
      <div
        className={`inspector-panel__title-card ${
          image !== null ? 'inspector-panel-content--image-background' : ''
        }`}
        style={{ backgroundImage: image !== null ? `url(${image})` : '' }}
      >
        <div className="inspector-panel-content__title-card-top">
          <Typography className={classes.titleCard} variant="h4">
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
              <CloseIcon className={classes.controlIcon} />
            </IconButton>
          </div>
        </div>
        <ImageUpload handleSelectedImage={handleSelectedImage} />
      </div>
      <div className="inspector-panel-content__contents inspector-panel-content__add-fields">
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
        <div className="inspector-panel-content__edit-buttons">
          <Button variant="contained" color="primary" onClick={() => handleSubmit(values)}>
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export const InspectorPanelContentView = ({
  plant,
  handleModifyPlant,
  handleClose,
}: InspectorPanelContentViewProps) => {
  const { altName, name, id, imageFileName: currentImageFileName, imageURL } = plant
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
    const db = getDatabase()
    const storage = getStorage()
    setEditMode('')
    if (!!newImageFile) {
      // upload the image file to firebase storage
      storage.uploadImage(newImageFile, id, (snapshot: firebase.storage.UploadTaskSnapshot) => {
        console.log('New image successfully uploaded')
        // set new file name in the plant's document in firestore
        db.updatePlantImageFileName(id, newImageFile.name, () => {
          console.log('Image file name updated in db')
        })
        // if an old image exists, delete it
        !!currentImageFileName &&
          storage.deleteImage(id, currentImageFileName, () => {
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
      <div className="inspector-panel__title-card" style={getImage()}>
        <div className="inspector-panel-content__title-card-top">
          {editMode !== 'names' && (
            <div>
              <Typography className={classes.titleCard} variant="h4">
                {name}
              </Typography>
              <Typography className={classes.titleCard}>{altName}</Typography>
            </div>
          )}
          <div className="inspector-panel-content__controls">
            {editMode === '' && (
              <>
                <IconButton color="inherit" edge="end" onClick={handleClickMenu}>
                  <MoreVertIcon className={classes.controlIcon} />
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
              </>
            )}
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => {
                setPreviewImageURL('')
                handleClose()
              }}
            >
              <CloseIcon className={classes.controlIcon} />
            </IconButton>
          </div>
        </div>
        {editMode === 'image' && (
          <div className="inspector-panel-content__edit-fields">
            <ImageUpload onlyDropzone handleSelectedImage={handleSelectedImage} />
            <div className="inspector-panel-content__edit-buttons">
              <Button
                color="inherit"
                onClick={() => {
                  setPreviewImageURL('')
                  setEditMode('')
                }}
              >
                Cancel
              </Button>
              <Button disabled={!newImageFile} onClick={() => handleUploadNewImage()}>
                Change image
              </Button>
            </div>
          </div>
        )}
        {editMode === 'names' && (
          <div className="inspector-panel-content__edit-fields">
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
            <div className="inspector-panel-content__edit-buttons">
              <Button onClick={handleEndEditNames}>Cancel</Button>
              <Button onClick={() => handleSubmitEdit(values)}>Confirm Changes</Button>
            </div>
          </div>
        )}
      </div>
      <div className="inspector-panel-content__contents">
        <EventSection
          eventType={PlantEventType.WATER}
          plant={plant}
          handleModifyPlant={handleModifyPlant}
        />
        <EventSection
          eventType={PlantEventType.FERTILIZE}
          plant={plant}
          handleModifyPlant={handleModifyPlant}
        />
      </div>
    </>
  )
}

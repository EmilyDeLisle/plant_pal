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

export const InspectorPanel = () => {


  return (
    <div className='inspector-panel__container'>
    </div>
  )

}


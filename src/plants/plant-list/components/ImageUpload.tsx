import React, { useState } from 'react'
import Dropzone, { IExtra, IFileWithMeta, ILayoutProps, StatusValue } from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CameraIcon from '@material-ui/icons/CameraAlt'

const Layout = ({ input, dropzoneProps, extra: { maxFiles } }: ILayoutProps) => {
  return <div {...dropzoneProps}>{input}</div>
}

interface ImageUploadProps {
  onlyDropzone?: boolean
  handleSelectedImage: (image: IFileWithMeta) => void
  handleCancel?: () => void
}

export const ImageUpload = ({
  onlyDropzone,
  handleSelectedImage,
  handleCancel,
}: ImageUploadProps) => {
  const [showDropzone, setShowDropzone] = useState(onlyDropzone ?? false)
  const [imageChosen, setImageChosen] = useState(false)

  const classNames = {
    dropzone: 'image-upload__dropzone',
    inputLabel: 'image-upload__input-label',
  }

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      handleSelectedImage(file)
      setImageChosen(true)
      setShowDropzone(false)
    }
  }

  const getDropzone = () => (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      maxFiles={1}
      maxSizeBytes={1048576}
      multiple={false}
      LayoutComponent={Layout}
      accept=".png, .jpg, .jpeg"
      classNames={classNames}
      inputContent={(files, extra) =>
        extra.reject ? '1 MB or less PNG or JPG/JPEG files only' : 'Click or drag and drop an image file'
      }
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    />
  )

  return onlyDropzone ? (
    getDropzone()
  ) : showDropzone ? (
    <div>
      {getDropzone()}
      <Button color="inherit" onClick={() => setShowDropzone(false)}>
        Cancel
      </Button>
    </div>
  ) : (
    <div className="image-upload__button-area">
      <div className="image-upload__button">
        <Tooltip placement="right" title={imageChosen ? 'Change image' : 'Upload image'}>
          <IconButton edge="start" color="inherit" onClick={() => setShowDropzone(true)}>
            <CameraIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

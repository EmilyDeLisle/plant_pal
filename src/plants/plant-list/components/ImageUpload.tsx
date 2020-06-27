import React, { useState } from 'react'
import Dropzone, {
  IFileWithMeta,
  ILayoutProps,
  StatusValue,
} from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CameraIcon from '@material-ui/icons/CameraAlt'

const Layout = ({ input, dropzoneProps, extra: { maxFiles } }: ILayoutProps) => {
  return <div {...dropzoneProps}>{input}</div>
}

interface ImageUploadProps {
  handleSelectedImage: (image: IFileWithMeta) => void
}

export const ImageUpload = ({ handleSelectedImage }: ImageUploadProps) => {
  const [showDropzone, setShowDropzone] = useState(false)
  const [imageChosen, setImageChosen] = useState(false)

  const classNames = {
    dropzone: 'image-upload__dropzone',
    inputLabel: 'image-upload__input-label',
  }

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      console.log(file)
      handleSelectedImage(file)
      setImageChosen(true)
      setShowDropzone(false)
    }
  }

  return showDropzone ? (
    <div>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        LayoutComponent={Layout}
        accept=".png, .jpg, .jpeg"
        classNames={classNames}
        inputContent={(files, extra) =>
          extra.reject
            ? 'PNG or JPG/JPEG files only'
            : 'Click or drag and drop an image file'
        }
        styles={{
          dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
          inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
        }}
      />
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

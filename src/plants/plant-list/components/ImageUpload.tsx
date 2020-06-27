import React, { useState } from 'react'
import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  IInputProps,
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
  handleSelectedImage: (image: string) => void
}

export const ImageUpload = ({ handleSelectedImage }: ImageUploadProps) => {
  const [showDropzone, setShowDropzone] = useState(false)
  const [imageChosen, setImageChosen] = useState(false)

  const classNames = {
    dropzone: 'image-upload__dropzone',
    inputLabel: 'image-upload__input-label',
  }

  const handleSubmit: IDropzoneProps['onSubmit'] = (files, allFiles) => {
    console.log(files.map((f) => f.meta))
    allFiles.forEach((f) => f.remove())
  }

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    const url = file.meta.previewUrl
    if (status === 'done' && !!url) {
      console.log(file)
      handleSelectedImage(url)
      setImageChosen(true)
      setShowDropzone(false)
    }
  }

  return showDropzone ? (
    <div>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
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

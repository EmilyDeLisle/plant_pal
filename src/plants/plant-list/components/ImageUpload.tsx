import React from 'react'
import Dropzone, { IDropzoneProps, StatusValue, IFileWithMeta } from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'

interface ImageUploadProps {
  handleSelectedImage: (image: string) => void
}

export const ImageUpload = ({ handleSelectedImage }: ImageUploadProps) => {

  const handleSubmit: IDropzoneProps['onSubmit'] = (files, allFiles) => {
    console.log(files.map((f) => f.meta))
    allFiles.forEach((f) => f.remove())
  }

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    const url = file.meta.previewUrl
    if (status === 'done' && !!url) {
      console.log(file)
      handleSelectedImage(url)
    }
  }

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={1}
      multiple={false}
      accept=".png, .jpg, .jpeg"
      inputContent={(files, extra) =>
        extra.reject ? 'PNG or JPG/JPEG files only' : 'Drag and drop an image file for this plant'
      }
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    />
  )
}

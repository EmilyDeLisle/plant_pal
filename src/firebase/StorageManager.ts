import firebase, { storage } from 'firebase/app'
import 'firebase/auth'
import imageCompression from 'browser-image-compression'
import { getAuth } from './init'

export default class StorageManager {
  static instance: StorageManager
  storageRef: storage.Reference
  imagesRef: storage.Reference | null = null

  /**
   * Get an instance of StorageManager.
   * @returns {StorageManager}
   *  Instance of StorageManager
   */
  static getInstance() {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  constructor() {
    if (StorageManager.instance) {
      throw new Error('StorageManager is a singleton class')
    }
    this.storageRef = firebase.storage().ref()
  }

  setReference = () => {
    const uuid = getAuth().getCurrentUser()?.uid
    if (!this.imagesRef) {
      this.imagesRef = !!uuid ? this.storageRef.child(uuid) : null
    }
  }

  unsetReference = () => {
    this.imagesRef = null
  }

  getImage = (
    plantID: string,
    imageFileName: string,
    handleImage?: (url: string) => void,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.setReference()
    this.imagesRef
      ?.child(`${plantID}/${imageFileName}`)
      .getDownloadURL()
      .then((url: string) => {
        !!handleImage && handleImage(url)
      })
      .catch((error: any) => {
        !!onError && onError(error)
        console.log('getDownloadURL failed')
      })
  }

  uploadImage = (
    imageFile: File,
    plantID: string,
    onSuccess?: (a: storage.UploadTaskSnapshot) => any,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.setReference()

    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    imageCompression(imageFile, compressionOptions).then((compressedFile) => {
      !!this.imagesRef &&
        this.imagesRef
          .child(`${plantID}/${imageFile.name}`)
          .put(compressedFile)
          .then(onSuccess)
          .catch(onError)
    })
  }

  deleteImage = (
    plantID: string,
    prevFileName: string,
    onSuccess?: (a: storage.UploadTaskSnapshot) => any,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.setReference()
    !!this.imagesRef &&
      this.imagesRef.child(`${plantID}/${prevFileName}`).delete().then(onSuccess).catch(onError)
  }
}

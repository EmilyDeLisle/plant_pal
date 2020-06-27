import firebase, { storage } from 'firebase/app'
import 'firebase/auth'
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
    this.imagesRef = uuid ? this.storageRef.child(uuid) : null
  }

  getImage = (
    imagePath: string,
    handleImage?: (url: string) => void,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.setReference()
    this.storageRef
      ?.child(imagePath)
      .getDownloadURL()
      .then((url: string) => {
        !!handleImage && handleImage(url)
      })
      .catch(onError)
  }

  uploadImage = (
    imageFile: File,
    plantID: string,
    onSuccess?: (a: storage.UploadTaskSnapshot) => any,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.setReference()
    !!this.imagesRef &&
      this.imagesRef
        .child(`${plantID}/${imageFile.name}`)
        .put(imageFile)
        .then(onSuccess)
        .catch(onError)
  }
}

import firebase, { storage } from 'firebase/app'
import 'firebase/auth'
import { getAuth } from './init'

export default class StorageManager {
  static instance: StorageManager
  storageRef: storage.Reference

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

  getImage = (
    imagePath: string,
    handleImage?: (url: string) => void,
    onError?: (reason: any) => void | PromiseLike<void>
  ): void => {
    this.storageRef
      ?.child(imagePath)
      .getDownloadURL()
      .then((url: string) => {
        console.log(url)
        !!handleImage && handleImage(url)
      })
      .catch(onError)
  }
}

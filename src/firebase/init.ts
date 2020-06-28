import firebase from 'firebase/app'
import AuthenticationManager from './AuthenticationManager'
import DatabaseManager from './DatabaseManager'
import StorageManager from './StorageManager'
import { CONFIG } from './firebaseConfig'

let initialized = false

const init = (): void => {
  if (!initialized) {
    firebase.initializeApp(CONFIG)
    initialized = true
  }
}

export const getAuth = (): AuthenticationManager => {
  init()
  return AuthenticationManager.getInstance()
}

export const getDatabase = (): DatabaseManager => {
  init()
  return DatabaseManager.getInstance()
}

export const getStorage = (): StorageManager => {
  init()
  return StorageManager.getInstance()
}

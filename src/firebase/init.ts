import firebase from 'firebase/app'
import DatabaseManager from './DatabaseManager'
import { CONFIG } from './firebaseConfig'

let initialized = false

const init = (): void => {
  if (!initialized) {
    firebase.initializeApp(CONFIG)
    initialized = true
  }
}

export const getDatabase = (): DatabaseManager => {
  init()
  return DatabaseManager.getInstance()
}

import firebase from 'firebase/app'
import DatabaseManager from './DatabaseManager'

const CONFIG = {
  apiKey: 'AIzaSyBNKpeVPa3qZ6oJZ4w9iPjKUpxKX3tB9QI',
  authDomain: 'plant-pal-app.firebaseapp.com',
  databaseURL: 'https://plant-pal-app.firebaseio.com',
  projectId: 'plant-pal-app',
  storageBucket: 'plant-pal-app.appspot.com',
  messagingSenderId: '542248820814',
  appId: '1:542248820814:web:fac3faac1267a891cc631f',
  measurementId: 'G-F1VTE91K0F',
}

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

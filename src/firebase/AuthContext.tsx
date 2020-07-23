import React, { useEffect, useState, ReactElement } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { User } from 'firebase/app'
import { getAuth, getDatabase, getStorage } from './init'
import { plantStore } from '../injectables'


export const AuthContext = React.createContext<User | null>(null)

interface AuthProviderProps {
  children: ReactElement[]
}

export const AuthProvider = ({ children }: AuthProviderProps & RouteComponentProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    getAuth().auth.onAuthStateChanged((user: User | null) => {
      if (!!user) {
        setCurrentUser(user)
        navigate('/plants')
        plantStore.getPlants()
      } else {
        const db = getDatabase()
        const storage = getStorage()
        navigate('/')
        plantStore.clearStore()
        !!db.unsubscribe && db.unsubscribe()
        db.unsetReference()
        storage.unsetReference()
      }
    })
  }, [])

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
}

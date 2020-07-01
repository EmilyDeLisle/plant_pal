import React, { useEffect, useState, ReactElement } from 'react'
import { User } from 'firebase/app'
import { getAuth, getDatabase } from './init'
import { plantStore } from '../injectables'
import { RouteComponentProps, navigate } from '@reach/router'

export const AuthContext = React.createContext<User | null>(null)

interface AuthProviderProps {
  children: ReactElement[]
}

export const AuthProvider = ({ children }: AuthProviderProps & RouteComponentProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    getAuth().auth.onAuthStateChanged((user) => {
      if (!!user) {
        setCurrentUser(user)
        navigate('/plants')
        plantStore.getPlants()
      } else {
        const db = getDatabase()
        navigate('/')
        plantStore.clearStore()
        !!db.unsubscribe && db.unsubscribe()
        db.unsetReference()
      }
    })
  }, [])

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
}

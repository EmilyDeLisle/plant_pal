import React, { useEffect, useState, ReactElement } from 'react'
import { User } from 'firebase/app'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getAuth } from './init'
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
        navigate('/')
      }
    })
  }, [])

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
}

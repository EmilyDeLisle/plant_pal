import { Moment } from 'moment'
import { Map } from './Map'

export interface FormValues extends Map {
  name: string
  altName: string
}

export interface AddFormValues extends FormValues {
  lastWateredDate: Moment | null
  lastFertilizedDate: Moment | null
  fileName: string
}

export interface SignInFormValues extends Map {
  email: string,
  password: string
}

export interface SignUpFormValues extends SignInFormValues {
  passwordConfirm: string
}

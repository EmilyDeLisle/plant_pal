import { Moment } from 'moment'

export interface FormValues {
  name: string
  altName: string
}

export interface AddFormValues extends FormValues {
  lastWateredDate: Moment | null
  lastFertilizedDate: Moment | null
  fileName: string
}

export interface SignInFormValues {
  email: string,
  password: string
}

export interface SignUpFormValues extends SignInFormValues {
  passwordConfirm: string
}

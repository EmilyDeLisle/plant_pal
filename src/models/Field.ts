export interface Field {
  name: string
  type: 'email' | 'password' | 'text'
  label: string
  required: boolean
}

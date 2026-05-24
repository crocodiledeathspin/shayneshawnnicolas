export interface UserDetails {
  user_id: number
  full_name: string
  username: string
  role: 'owner' | 'staff'
}

export interface LoginCredentialsErrorFields {
  username?: string[]
  password?: string[]
}

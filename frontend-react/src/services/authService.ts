import { apiRequest } from '../lib/api'
import type { LoginCredentials, LoginResponse, SignupCredentials, SignupResponse, User } from '../types'

export function getStoredUser(): User | null {
  const stored = localStorage.getItem('currentUser')
  return stored ? (JSON.parse(stored) as User) : null
}

export function storeUser(user: User | null): void {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
  } else {
    localStorage.removeItem('currentUser')
  }
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  return {
    id: '',
    name: '',
    email: credentials.email,
    token: response.token,
  }
}

export async function signup(credentials: SignupCredentials): Promise<User> {
  const response = await apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  return {
    id: response.id,
    name: response.name,
    email: response.email,
  }
}

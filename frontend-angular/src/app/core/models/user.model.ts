export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
}

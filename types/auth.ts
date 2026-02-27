export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
  user: UserPublic;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

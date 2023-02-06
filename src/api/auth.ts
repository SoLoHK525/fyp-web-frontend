import { request } from './_base';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
}

export const loginWithEmail = (payload: LoginPayload) => request<LoginResponse>('post', '/auth/login', payload, false);

export const getProfile = () => request<User>('get', '/auth/profile');
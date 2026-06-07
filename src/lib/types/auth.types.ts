export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CHILD' | 'PARENT' | 'ADMIN';
  created_at: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

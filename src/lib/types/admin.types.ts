export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'CHILD' | 'PARENT' | 'ADMIN';
  created_at: string;
}

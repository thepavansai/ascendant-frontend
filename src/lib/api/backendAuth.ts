import axios from 'axios';
import { useTokenStore } from '../store/tokenStore';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const backendAuthApi = {
  register: async (data: { name: string; email: string; password: string; role: string; parentEmail?: string }) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, data);
    return response.data; // Returns AuthResponse with token, refreshToken, user
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
    return response.data; // Returns AuthResponse with token, refreshToken, user
  },

  refresh: async (refreshToken: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/refresh`, { refresh_token: refreshToken });
    return response.data; // Returns AuthResponse with new token
  },

  logout: async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${useTokenStore.getState().accessToken}`,
        },
      });
    } catch {
      // Ignore errors, client-side logout is sufficient
    } finally {
      useTokenStore.getState().clearTokens();
    }
  },

  adminLogin: async (email: string, password: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/admin-login`, { email, password });
    return response.data; // Returns AuthResponse with token, refreshToken, user
  },
};

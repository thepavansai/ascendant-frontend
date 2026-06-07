import axios from 'axios';
import { useTokenStore } from '../store/tokenStore';
import { backendAuthApi } from './backendAuth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useTokenStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useTokenStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await backendAuthApi.refresh(refreshToken);
        const { token, refreshToken: newRefreshToken, user } = response;

        useTokenStore.getState().setTokens(token, newRefreshToken, user.id, {
          name: user.name,
          role: user.role,
        });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        useTokenStore.getState().clearTokens();
        window.location.href = '/account/signin';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      useTokenStore.getState().clearTokens();
      window.location.href = '/account/signin';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

import { useTokenStore } from '../store/tokenStore';

export function useAuth() {
  const { userId, userName, userRole, accessToken } = useTokenStore();
  return {
    userId,
    userName,
    userRole,
    isAuthenticated: Boolean(accessToken && userId),
  };
}

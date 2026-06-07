export function getHomePathForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PARENT':
      return '/parent/dashboard';
    case 'CHILD':
    default:
      return '/dashboard';
  }
}

export function resolvePostAuthRedirect(callbackUrl: string | null, role: string): string {
  if (callbackUrl && callbackUrl !== '/') {
    return callbackUrl;
  }
  return getHomePathForRole(role);
}

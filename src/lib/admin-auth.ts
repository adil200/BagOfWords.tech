/**
 * Admin Authentication Utility
 * Manages admin session state using sessionStorage
 * Reuses the same AUTHOR_PASSWORD from .env as comment admin system
 */

export const ADMIN_SESSION_KEY = 'isAdmin';

/**
 * Check if user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

/**
 * Set admin authentication status
 */
export function setAdminAuth(isAuthenticated: boolean): void {
  if (typeof window === 'undefined') return;
  
  if (isAuthenticated) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

/**
 * Verify admin password via API
 */
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/verify-author-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Password verification error:', error);
    return { success: false, message: 'Failed to verify password' };
  }
}

/**
 * Logout admin
 */
export function logoutAdmin(): void {
  setAdminAuth(false);
}

'use client';

import { useState, useEffect } from 'react';
import { isAdminAuthenticated, setAdminAuth, logoutAdmin as logoutAdminUtil } from '@/lib/admin-auth';

/**
 * Custom hook for admin authentication state
 */
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    setIsAdmin(isAdminAuthenticated());
    setIsLoading(false);

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      setIsAdmin(isAdminAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginAdmin = () => {
    setAdminAuth(true);
    setIsAdmin(true);
  };

  const logoutAdmin = () => {
    logoutAdminUtil();
    setIsAdmin(false);
  };

  return {
    isAdmin,
    isLoading,
    loginAdmin,
    logoutAdmin,
  };
}

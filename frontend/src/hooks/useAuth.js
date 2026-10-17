import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getAccessToken, clearAuthSession } from '../services/api';

/**
 * Enterprise Production-Grade useAuth Hook
 * Reactively subscribes to carzodrive-auth-change events and cross-tab storage events
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [token, setToken] = useState(() => getAccessToken());

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getCurrentUser());
      setToken(getAccessToken());
    };

    window.addEventListener('carzodrive-auth-change', syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('carzodrive-auth-change', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const openAuthModal = useCallback((mode = 'login') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carzodrive-open-auth', { detail: { mode } }));
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
  }, []);

  const isAuthenticated = Boolean(currentUser && token);

  return {
    currentUser,
    token,
    isAuthenticated,
    openAuthModal,
    logout,
  };
}

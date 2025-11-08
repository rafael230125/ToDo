/**
 * Hook customizado para autenticação
 * 
 * Fornece funcionalidades de autenticação de forma simples
 */

import { useState, useEffect } from 'react';
import { getCurrentAuthUser, isAuthenticated } from '../services/authService';
import { getCurrentUser } from '../services/userService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}


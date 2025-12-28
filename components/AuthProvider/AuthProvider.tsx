'use client';

import { useEffect, useState } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);

  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isChecking) {
    return <p>Loading...</p>;
  }

  return children;
}


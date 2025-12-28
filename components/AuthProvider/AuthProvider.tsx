'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const privateRoutes = ['/profile', '/notes'];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
      );

      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        const user = await getMe();
        if (user) {
          setUser(user);
          setIsLoading(false);
          return;
        }
      }

      if (isPrivateRoute) {
        await logout();
        clearIsAuthenticated();
        router.push('/sign-in');
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}

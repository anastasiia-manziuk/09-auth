import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const authRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      const setCookie = response.headers?.['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];


        for (const cookie of cookieArray) {
          const parsed = parse(cookie);

          if (parsed.accessToken) {
            cookieStore.set('accessToken', parsed.accessToken);
          }

          if (parsed.refreshToken) {
            cookieStore.set('refreshToken', parsed.refreshToken);
          }
        }
      }
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  if (isPrivateRoute && !cookieStore.get('accessToken')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && cookieStore.get('accessToken')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

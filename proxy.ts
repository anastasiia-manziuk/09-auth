import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const authRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const response = await checkSession();
        const setCookie = response.headers['set-cookie'];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: parsed['Max-Age']
                ? Number(parsed['Max-Age'])
                : undefined,
            };

            if (parsed.accessToken) {
              cookieStore.set('accessToken', parsed.accessToken, options);
            }

            if (parsed.refreshToken) {
              cookieStore.set('refreshToken', parsed.refreshToken, options);
            }
          }
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      } catch {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

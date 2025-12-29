import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy wrapper for route protection
 * Required by assignment structure
 */
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

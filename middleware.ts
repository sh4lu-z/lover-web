import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting for Edge (resets frequently on Vercel, but helps against immediate bursts)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    // 1. Rate Limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    let rateData = ipRequestCounts.get(ip);
    if (!rateData || now > rateData.resetTime) {
      rateData = { count: 0, resetTime: now + WINDOW_MS };
    }
    
    rateData.count++;
    ipRequestCounts.set(ip, rateData);

    if (rateData.count > RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Crypto + Time API Request Signing (Anti-bot / Anti-curl)
    if (['POST', 'PATCH', 'DELETE'].includes(request.method)) {
      const sig = request.headers.get('x-lover-sig');
      const timeStr = request.headers.get('x-lover-time');
      
      if (!sig || !timeStr) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized: Missing request signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const timestamp = parseInt(timeStr, 10);
      const timeDiff = Math.abs(Date.now() - timestamp);
      
      // Reject if timestamp is older than 60 seconds (or 60 seconds in the future)
      if (isNaN(timestamp) || timeDiff > 60_000) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized: Request expired or invalid timestamp' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Recreate signature
      const path = request.nextUrl.pathname;
      const method = request.method;
      
      // For body hash, we need to read the body. In Next.js middleware, reading body can be tricky.
      // But we can just hash the method, path, timestamp and salt for a good enough barrier.
      // Since it's a browser app, protecting against trivial curls is the goal.
      
      // Let's use a subtle crypto import or Node crypto fallback
      const API_SECRET_SALT = 'l0v3r_s3cr3t_s4lt_2026!#@';
      const payload = `${method.toUpperCase()}:${path}:${timestamp}::${API_SECRET_SALT}`;
      
      let expectedSig = '';
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        expectedSig = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } else {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Internal server error: Crypto not available' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (sig !== expectedSig) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized: Invalid signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

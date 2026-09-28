export const API_SECRET_SALT = 'l0v3r_s3cr3t_s4lt_2026!#@';

export async function generateApiSignature(path: string, method: string, timestamp: number, bodyStr: string = ''): Promise<string> {
  const payload = `${method.toUpperCase()}:${path}:${timestamp}::${API_SECRET_SALT}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // For edge/node fallback if needed
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

export async function fetchSecureApi(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  
  if (['POST', 'PATCH', 'DELETE'].includes(method)) {
    const timestamp = Date.now();
    
    // Extract path from URL (remove query params for the basic hash)
    // Note: Our middleware uses request.nextUrl.pathname which is just the path
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    
    const sig = await generateApiSignature(path, method, timestamp);
    
    const headers = new Headers(options.headers || {});
    headers.set('x-lover-time', timestamp.toString());
    headers.set('x-lover-sig', sig);
    
    options.headers = headers;
  }
  
  return fetch(url, options);
}

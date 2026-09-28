/**
 * Domain & URL configuration for Lover
 * Primary domain: lover.s4z.top (strictly lowercase)
 */
export const APP_DOMAIN = 'lover.s4z.top';
export const APP_BASE_URL = `https://${APP_DOMAIN}`;

export function getAppUrl(path: string = ''): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_BASE_URL}${cleanPath}`;
}

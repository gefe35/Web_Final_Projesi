import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Yetkili kullanıcı isteklerine JWT erişim jetonunu ekler.
 * Token alma/yenileme uçları ile harici (GitHub vb.) istekler hariç tutulur.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApi = req.url.includes('/api/');
  const isTokenEndpoint = req.url.includes('/api/token');

  let token: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('access_token');
  }

  if (isApi && !isTokenEndpoint && token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};

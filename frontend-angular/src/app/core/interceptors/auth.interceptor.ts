import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return next(cloned);
    }
  }
  return next(req);
};

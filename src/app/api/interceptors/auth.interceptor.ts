import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Telegram } from '../../telegram/telegram';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tgService = inject(Telegram)
  const initData = tgService.tg.initData;   

  const modifiedReq = req.clone({
    setHeaders: {
      'Authorization': `tma ${initData}`
    }
  });

  return next(modifiedReq);
};

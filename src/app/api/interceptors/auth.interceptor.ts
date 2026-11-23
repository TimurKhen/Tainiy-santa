import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Telegram } from '../../telegram/telegram';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tgService = inject(Telegram);
  if (tgService.tg !== null) {
    const initData = tgService.tg.initData;

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `tma ${initData}`,
      },
    });
    return next(modifiedReq);
  } else {
    return next(req);
  }
};

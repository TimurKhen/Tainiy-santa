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
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `tma auth_date=1795538959&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22grr%22%2C%22photo_url%22%3A%22bvbgfb%22%7D&hash=0ee8718a4c7771c31b8b85134998e6bf59833b835c56c7f4c9412d6f5601f436`,
      },
    });
    return next(modifiedReq);
  }
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Telegram } from '../../telegram/telegram';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tgService = inject(Telegram);
  if (environment.isProduction) {
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
        // 'Authorization': `tma ${initData}`
        Authorization: `tma auth_date=1795266237&user=%7B%22id%22%3A123321456%2C%22first_name%22%3A%22Vasya%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22vss%22%2C%22photo_url%22%3A%22bvbgfb%22%7D&hash=afcf8ed44534e8ab5b7654116b65fbc051abc9c2793f0fffb600570a47721f89`,
      },
    });
    return next(modifiedReq);
  }
};

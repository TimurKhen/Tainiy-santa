import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GroupContext } from './services/group-context';
import { catchError, map, of } from 'rxjs';

export const groupOwnerGuard: CanActivateFn = (route) => {
  const groupContext = inject(GroupContext);
  const router = inject(Router);

  const id = route.parent?.paramMap.get('id');

  if (!id) {
    return router.createUrlTree(['/']);
  }

  return groupContext.ensureLoaded(id).pipe(
    map(() => {
      return groupContext.isOwner() ? true : router.createUrlTree(['/group', id]);
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};

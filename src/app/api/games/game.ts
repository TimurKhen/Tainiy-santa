import { inject, Service } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { Group } from '../../interfaces/group/group';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user';

@Service()
export class Game {
  private http = inject(HttpClient);
  private userService = inject(UserService);

  getGames(): Observable<Group[]> {
    return this.userService.getGroups();
  }

  getGame(id: string): Observable<Group> {
    return of({
      name: 'Test',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2026, 11, 3),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2026, 10, 1),
      },
      isSelectedGifters: true,
      groupId: id,
      isEnded: false,
      icon: '',
    });
  }

  createGame(gameInfo: {
    name: string;
    budget: number;
    distributionDate: Date | null;
    swapDate: Date | null;
    icon: string | File;
    place: string;
  }): Observable<any> {
    const formData = new FormData();

    formData.append('name', gameInfo.name);
    formData.append('budget', gameInfo.budget.toString());
    formData.append('place', gameInfo.place);

    if (gameInfo.distributionDate) {
      formData.append('distributionDate', gameInfo.distributionDate as any);
    }
    if (gameInfo.swapDate) {
      formData.append('swapDate', gameInfo.swapDate as any);
    }

    if (gameInfo.icon instanceof File) {
      formData.append('icon', gameInfo.icon, gameInfo.icon.name);
    } else {
      formData.append('icon', gameInfo.icon);
    }

    return of({ success: true, id: Date.now() }).pipe(
      delay(600),
      tap(() => {
        this.userService.addMockGroup({
          name: gameInfo.name,
          budget: gameInfo.budget,
          place: gameInfo.place,
          swapDate: gameInfo.swapDate,
          distributionDate: gameInfo.distributionDate,
        });

        this.userService.clearCache();
      }),
    );

    return this.http.post('/api/games', formData).pipe(
      tap(() => {
        this.userService.clearCache();
      }),
    );
  }
}

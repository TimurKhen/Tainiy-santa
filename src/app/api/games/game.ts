import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group } from '../../interfaces/group/group';
import { HttpClient } from '@angular/common/http';

@Service()
export class Game {
  private http = inject(HttpClient);

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
}

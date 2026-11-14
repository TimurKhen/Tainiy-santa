import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group } from '../../interfaces/group/group';
import { HttpClient } from '@angular/common/http';

@Service()
export class Game {
  private http = inject(HttpClient);

  getGames(): Observable<Group[]> {
    // return this.http.get()
    return of([
    {
      name: 'Test',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2026, 11, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2026, 11, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: '',
    },
    {
      name: 'Test',
      membersId: [
        -9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 2, 3, -9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      ],
      adminId: -19,
      data: {
        swapDate: new Date(2027, 11, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2025, 5, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: 'test',
    },
    {
      name: 'Test',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2026, 10, 12, 22, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2026, 10, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: 'test',
    },
    {
      name: 'Test 2',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2025, 12, 30),
        distributionDate: new Date(2025, 11, 11),
        where: 'У Илюхи',
        money: 1200,
      },
      isSelectedGifters: true,
      groupId: '',
      isEnded: true,
      icon: 'test',
    }
  ]); 
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
}

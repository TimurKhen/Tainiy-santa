import { inject, Service } from '@angular/core';
import { delay, Observable, of, switchMap, tap } from 'rxjs';
import { Group } from '../../interfaces/group/group';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user';
import { FileSend } from '../file/file-send';

@Service()
export class Game {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private fileSendService = inject(FileSend);
  private apiUrl = '/api/groups';

  getGames(): Observable<Group[]> {
    return this.userService.getGroups();
  }

  getGame(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  createGame(gameInfo: {
    name: string;
    budget: number;
    distributionDate: Date | null;
    swapDate: Date | null;
    icon: string | File;
    place: string;
  }): Observable<any> {
    const icon$: Observable<string> =
      gameInfo.icon instanceof File
        ? this.fileSendService.sendFile(gameInfo.icon)
        : of(gameInfo.icon);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return icon$.pipe(
      switchMap((icon) => {
        const payload = {
          name: gameInfo.name,
          money: gameInfo.budget,
          place: gameInfo.place,
          icon,
          ...(gameInfo.distributionDate && {
            distribution_date: gameInfo.distributionDate.toISOString(),
          }),
          ...(gameInfo.swapDate && {
            swap_date: gameInfo.swapDate.toISOString(),
          }),
        };

        return this.http.post(this.apiUrl + '/create', payload, { headers });
      }),
    );
  }

  changeSettings(
    id: number,
    budget: number,
    distributionDate: string,
    swapDate: string,
    place: string,
  ) {
    return this.http.patch(`${this.apiUrl}/${id}`, {
      budget,
      place,
      distribution_date: distributionDate,
      swap_date: swapDate,
    });
  }

  deleteGame(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  makeDistribution(id: number) {
    return this.http.post(`${this.apiUrl}/distribution/${id}`, {});
  }

  leave(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

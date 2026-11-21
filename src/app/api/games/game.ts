import { inject, Service } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { Group } from '../../interfaces/group/group';
import { HttpClient } from '@angular/common/http';
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
    const formData = new FormData();

    formData.append('name', gameInfo.name);
    formData.append('budget', gameInfo.budget.toString());
    formData.append('place', gameInfo.place);

    if (gameInfo.distributionDate) {
      formData.append('distributionDate', gameInfo.distributionDate.toISOString());
    }
    if (gameInfo.swapDate) {
      formData.append('swapDate', gameInfo.swapDate.toISOString());
    }

    if (gameInfo.icon instanceof File) {
      this.fileSendService.sendFile(gameInfo.icon).subscribe((v) => {
        formData.append('icon', v);
      });
    } else {
      formData.append('icon', gameInfo.icon);
    }

    return this.http.post(this.apiUrl, formData);
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

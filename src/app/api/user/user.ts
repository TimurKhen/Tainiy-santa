import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { Group } from '../../interfaces/group/group';

export interface MeResponse {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  groups: Group[];
}

@Service()
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  // private me$?: Observable<MeResponse>;

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }

  getGroups(): Observable<Group[]> {
    return this.getMe().pipe(map((response) => response.groups));
  }

  // clearCache(): void {
  //   this.me$ = undefined;
  // }
}

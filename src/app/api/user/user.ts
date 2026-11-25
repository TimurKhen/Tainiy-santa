import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
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

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }

  getGroups(): Observable<Group[]> {
    return this.getMe().pipe(
      timeout({ each: 8000 }),
      map((response) => response?.groups ?? []),
    );
  }
}

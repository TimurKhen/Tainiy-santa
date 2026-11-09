import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { User } from '../../telegram/user';

const MOCK_DELAY_MS = 1500;

const MOCK_USERS: User[] = [
  {
    id: 1,
    first_name: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    last_name: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    username: 'ivan_petrov',
    language_code: 'ru',
    allows_write_to_pm: true,
    photo_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cqMXjTyXdxKBgCpdLMxLB9rHVv_dP5yQekydezkr8gRUfog5ZIXUieQ&s=10',
  },
  {
    id: 2,
    first_name: 'Илюха',
    last_name: 'Романов',
    username: 'anna_sid',
    language_code: 'en',
    allows_write_to_pm: false,
    photo_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cqMXjTyXdxKBgCpdLMxLB9rHVv_dP5yQekydezkr8gRUfog5ZIXUieQ&s=10',
  },
  {
    id: 3,
    first_name: 'Илюха',
    last_name: 'Романов',
    username: 'timur_k',
    language_code: 'ru',
    allows_write_to_pm: true,
    photo_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cqMXjTyXdxKBgCpdLMxLB9rHVv_dP5yQekydezkr8gRUfog5ZIXUieQ&s=10',
  },
];

@Service()
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  private useMock = true;

  getUserById(id: number): Observable<User> {
    if (this.useMock) {
      return this.getUserByIdMock(id);
    }
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  private getUserByIdMock(id: number): Observable<User> {
    const user = MOCK_USERS.find((u) => u.id === id);
    return user
      ? of(user).pipe(delay(MOCK_DELAY_MS))
      : throwError(() => new Error(`User ${id} not found`)).pipe(delay(MOCK_DELAY_MS));
  }
}

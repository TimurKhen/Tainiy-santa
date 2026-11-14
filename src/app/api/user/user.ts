import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { User } from '../../telegram/user';
import { Group } from '../../interfaces/group/group';

const MOCK_DELAY_MS = 1500;

interface MeResponse extends User {
  groups: Group[]
}

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

  private mockGroups: Group[] = [
    {
      groupId: '1',
      name: 'Новогодний Тайный Санта',
      membersId: [1, 2, 3],
      adminId: 1,
      data: {
        swapDate: new Date(2026, 11, 31),
        where: 'У бабушки',
        money: 1000,
        distributionDate: new Date(2026, 11, 15),
      },
      isSelectedGifters: true,
      isEnded: false,
      icon: '',
    },
    {
      groupId: '2',
      name: 'Прошлый год',
      membersId: [1, 2],
      adminId: 1,
      data: {
        swapDate: new Date(2025, 11, 31),
        where: 'Кафе',
        money: 500,
        distributionDate: new Date(2025, 11, 10),
      },
      isSelectedGifters: true,
      isEnded: true,
      icon: '',
    },
  ];

  private me$?: Observable<MeResponse>;

  getMe(): Observable<MeResponse> {
    if (!this.me$) {
      const mockResponse: MeResponse = {
        id: 12345678,
        first_name: 'Илья',
        last_name: 'Тестеров',
        username: 'ilya_test',
        language_code: 'ru',
        allows_write_to_pm: true,
        photo_url: 'https://via.placeholder.com/150',
        groups: this.mockGroups,
      };

      this.me$ = of(mockResponse).pipe(delay(400), shareReplay(1));
    }
    return this.me$;
  }

  getGroups(): Observable<Group[]> {
    return this.getMe().pipe(map((response) => response.groups));
  }

  clearCache(): void {
    this.me$ = undefined;
  }

  addMockGroup(newGame: {
    name: string;
    budget: number;
    place: string;
    swapDate: Date | null;
    distributionDate: Date | null;
  }) {
    const created: Group = {
      groupId: String(Date.now()),
      name: newGame.name,
      membersId: [12345678],
      adminId: 12345678,
      data: {
        swapDate: newGame.swapDate || new Date(),
        where: newGame.place,
        money: newGame.budget,
        distributionDate: newGame.distributionDate || new Date(),
      },
      isSelectedGifters: false,
      isEnded: false,
      icon: '',
    };
    this.mockGroups.unshift(created); // добавляем в начало
  }
}

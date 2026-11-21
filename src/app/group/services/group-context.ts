import { computed, inject, Service, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';
import { TypeDateService } from '../../groups/group-preview/type-date-service';
import { map, of, tap } from 'rxjs';
import { Telegram } from '../../telegram/telegram';
import { environment } from '../../../environments/environment';
import { UserService } from '../../api/user/user';

@Service()
export class GroupContext {
  private userService = inject(UserService);
  private tgService = inject(Telegram);
  private typeDateService = inject(TypeDateService);

  gameData = signal<Group | null>(null);
  gameTypeDate = signal<{ type: string; date: Date } | null>(null);

  isOwner = computed(() => {
    const game = this.gameData();
    const user = this.tgService.user;

    if (environment.debugOwner) return true;

    return !!game && !!user && game.admin_id === user.id;
  });

  ensureLoaded(id: number) {
    if (this.gameData()?.id === id) {
      return of(this.gameData());
    }

    return this.userService.getGroups().pipe(
      map((groups) => {
        const found = groups.find((group) => group.id === id);
        if (!found) {
          throw new Error(`Группа с id=${id} не найдена у пользователя`);
        }
        return found;
      }),
      tap((game) => {
        this.gameData.set(game);
        this.getTypeDate(game);
      }),
    );
  }

  clearCache(): void {
    this.gameData.set(null);
  }

  private getTypeDate(game: Group) {
    this.gameTypeDate.set(this.typeDateService.isDistributionEnded(game));
  }

  updateSettings(settings: {
    money: number;
    where: string;
    distributionDate: string;
    swapDate: string;
  }) {
    this.gameData.update((game) => {
      const updated: Group = {
        ...game!,
        ...settings,
      };

      this.getTypeDate(updated);
      return updated;
    });
  }
}

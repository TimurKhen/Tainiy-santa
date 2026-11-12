import { computed, inject, Service, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';
import { Game } from '../../api/games/game';
import { TypeDateService } from '../../groups/group-preview/type-date-service';
import { of, tap } from 'rxjs';
import { Telegram } from '../../telegram/telegram';
import { environment } from '../../../environments/environment';

@Service()
export class GroupContext {
  private gameService = inject(Game);
  private tgService = inject(Telegram);
  private typeDateService = inject(TypeDateService);

  gameData = signal<Group | null>(null);

  gameTypeDate = signal<{ type: string; date: Date } | null>(null);

  isOwner = computed(() => {
    const game = this.gameData();
    const user = this.tgService.user;

    if (environment.debugOwner) return true;

    return !!game && !!user && game.adminId === user.id;
  });

  ensureLoaded(id: string) {
    if (this.gameData()?.groupId === id) {
      return of(this.gameData());
    }

    return this.gameService.getGame(id).pipe(
      tap((game) => {
        game = {
          ...game,
          data: {
            ...game.data,
            distributionDate: new Date(game.data.distributionDate),
            swapDate: new Date(game.data.swapDate),
          },
        };

        this.gameData.set(game);
        this.getTypeDate(game);
      }),
    );
  }

  private getTypeDate(game: Group) {
    this.gameTypeDate.set(this.typeDateService.isDistributionEnded(game));
  }

  updateDates(distributionDate: Date, swapDate: Date) {
    this.gameData.update((game) => {
      if (!game) return game;

      const updated = {
        ...game,
        data: {
          ...game.data,
          distributionDate,
          swapDate,
        },
      };

      this.getTypeDate(updated);

      return updated;
    });
  }
}

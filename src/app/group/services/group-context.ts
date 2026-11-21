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

    return !!game && !!user && game.admin_id === user.id;
  });

  ensureLoaded(id: number) {
    if (this.gameData()?.id === id) {
      return of(this.gameData());
    }

    return this.gameService.getGame(id).pipe(
      tap((game) => {
        game = {
          ...game,
          distribution_date: game.distribution_date,
          swap_date: game.swap_date,
        };

        this.gameData.set(game);
        this.getTypeDate(game);
      }),
    );
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

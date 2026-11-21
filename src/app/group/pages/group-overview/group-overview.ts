import { Component, computed, effect, inject, signal } from '@angular/core';
import { Avatar } from '../../components/avatar/avatar';
import { DatePipe } from '@angular/common';
import { GroupContext } from '../../services/group-context';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../telegram/user';
import { Nickname } from '../../../components/nickname/nickname';
import { TgEmoji } from '../../../components/tg-emoji/tg-emoji';
import { Header } from './header/header';
import { MeResponse } from '../../../api/user/user';
import { Game } from '../../../api/games/game';

@Component({
  imports: [Avatar, DatePipe, RouterLink, Nickname, TgEmoji, Header],
  selector: 'app-group-overview',
  styleUrl: './group-overview.scss',
  templateUrl: './group-overview.html',
})
export class GroupOverview {
  private groupContext = inject(GroupContext);
  private gameService = inject(Game)
  private router = inject(Router);

  gameData = this.groupContext.gameData;
  isOwner = this.groupContext.isOwner;
  isSelectedGifters = computed(() => this.gameData()?.is_selected_gifters);
  whoGiftTo = signal<MeResponse | null>(null);
  today = signal<Date>(new Date());

  constructor() {
    effect(() => {
      if (this.isSelectedGifters()) {
        this.getWhoGiftTo();
      }
    });
  }

  protected setGroupIcon(icon: string): string {
    if (icon === 'snowflake' || icon === 'snowman' || icon === 'gift') {
      return `tgGifs/${icon}.webp`
    }
    return icon
  }

  protected getWhoGiftTo() {
    this.whoGiftTo.set(this.gameData()?.recipient!);
  }

  getDate(string: string): Date {
    return new Date(string);
  }

  onExit() {
    this.gameService.leave(this.gameData()?.id!).subscribe({
      next: () => {
        this.router.createUrlTree(['/']);
      },
      error: (err) => {
        alert(`Ошибка при выходе: ${err}`);
      },
    });
  };

  makeDistribution() {
    this.gameService.makeDistribution(this.gameData()?.id!).subscribe({
      next: () => {
        this.groupContext.clearCache();
        this.groupContext.ensureLoaded(this.gameData()?.id!);
      },
      error: (err) => {
        alert(`Ошибка при выходе: ${err}`);
      },
    });
  }
}

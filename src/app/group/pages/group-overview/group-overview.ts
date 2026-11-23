import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Avatar } from '../../components/avatar/avatar';
import { DatePipe } from '@angular/common';
import { GroupContext } from '../../services/group-context';
import { Router, RouterLink } from '@angular/router';
import { Nickname } from '../../../components/nickname/nickname';
import { Header } from './header/header';
import { MeResponse } from '../../../api/user/user';
import { Game } from '../../../api/games/game';
import { BackButton } from '../../../telegram/backButton/back-button';
import { Telegram } from '../../../telegram/telegram';
import { Skeleton } from './skeleton/skeleton';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatRippleModule } from '@angular/material/core';

@Component({
  imports: [Avatar, DatePipe, RouterLink, Nickname, Header, Skeleton, MatRippleModule],
  selector: 'app-group-overview',
  styleUrl: './group-overview.scss',
  templateUrl: './group-overview.html',
})
export class GroupOverview implements OnInit {
  private groupContext = inject(GroupContext);
  private gameService = inject(Game);
  private router = inject(Router);
  private backButtonService = inject(BackButton);
  private tgService = inject(Telegram);
  private clipboard = inject(Clipboard);

  whoGiftTo = signal<MeResponse | null>(null);
  today = signal<Date>(new Date());
  activeMemberId = signal<number | null>(null);
  removingIds = signal<Set<number>>(new Set());
  gameData = this.groupContext.gameData;
  isSelectedGifters = computed(() => this.gameData()?.is_selected_gifters);
  isOwner = this.groupContext.isOwner;
  currentUserId = this.tgService.user.id;

  constructor() {
    effect(() => {
      if (this.isSelectedGifters()) {
        this.getWhoGiftTo();
      }
    });
  }

  ngOnInit() {
    this.backButtonService.show();
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
        alert(`Ошибка при выходе: ${err.code}`);
      },
    });
  }

  makeDistribution() {
    const groupId = this.gameData()?.id;
    if (!groupId) return;

    this.gameService.makeDistribution(groupId).subscribe({
      next: () => {
        this.groupContext.ensureLoaded(groupId, true).subscribe({
          error: (err) => console.error('Не удалось обновить данные группы:', err),
        });
      },
      error: (err) => {
        console.error('Distribution error:', err);
        alert(`Ошибка при жеребьёвке: ${err.code ?? err.message ?? err}`);
      },
    });
  }

  onToggleMemberMenu(memberId: number) {
    this.activeMemberId.update((current) => (current === memberId ? null : memberId));
  }

  onMakeAdmin(member: any) {
    const currentGame = this.gameData();
    if (!currentGame) return;

    if (this.activeMemberId() === member.id) {
      this.activeMemberId.set(null);
    }

    const updatedGroup = {
      ...currentGame,
      admin_id: member.id,
    };

    this.gameService.changeSettings(updatedGroup).subscribe({
      next: () => {
        this.gameData.set(updatedGroup);
        this.groupContext.ensureLoaded(currentGame.id, true).subscribe({
          error: (err) => console.error('Не удалось обновить данные группы:', err),
        });
      },
      error: () => {
        alert('Не удалось назначить организатором');
      },
    });
  }

  onRemoveUser(member: any) {
    const id = member.id;
    if (this.activeMemberId() === id) {
      this.activeMemberId.set(null);
    }

    this.removingIds.update((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });

    setTimeout(() => {
      this.gameData.update((data) => {
        if (!data) return data;
        return {
          ...data,
          users: data.users.filter((u: any) => u.id !== id),
        };
      });

      this.removingIds.update((set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });

      this.gameService.removeUser(this.gameData()?.id!, id).subscribe();
    }, 280);
  }

  isRemoving(memberId: number): boolean {
    return this.removingIds().has(memberId);
  }

  protected setGroupIcon(icon: string): string {
    if (icon === 'tree' || icon === 'snowman' || icon === 'nonoice') {
      return `tgSvg/${icon}.svg`;
    }
    return icon;
  }

  protected getWhoGiftTo() {
    this.whoGiftTo.set(this.gameData()?.recipient!);
  }

  protected copyToClipboard() {
    const string = `https://t.me/secret_santa_rubot?start=${this.gameData()?.id}`;
    this.clipboard.copy(string);
  }
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { Avatar } from '../../components/avatar/avatar';
import { DatePipe } from '@angular/common';
import { GroupContext } from '../../services/group-context';
import { RouterLink } from '@angular/router';
import { User } from '../../../telegram/user';
import { Nickname } from '../../../components/nickname/nickname';
import { TgEmoji } from '../../../components/tg-emoji/tg-emoji';

@Component({
  imports: [Avatar, DatePipe, RouterLink, Nickname, TgEmoji],
  selector: 'app-group-overview',
  styleUrl: './group-overview.scss',
  templateUrl: './group-overview.html',
})
export class GroupOverview {
  groupContext = inject(GroupContext);

  gameData = this.groupContext.gameData;
  gameTypeDate = this.groupContext.gameTypeDate;
  isOwner = this.groupContext.isOwner;
  isSelectedGifters = computed(() => this.gameData()?.isSelectedGifters)
  whoGiftTo = signal<User | null>(null)
  today = signal<Date>(new Date());

  constructor() {
    effect(() => {
      if (this.isSelectedGifters()) {
        this.getWhoGiftTo()
      }
    })
  }

  protected setIcon(icon: string): { isUserAvatar: boolean; icon: string } {
    return {
      isUserAvatar: false,
      icon: 'tgGifs/christmasTree.webp',
    };
  }

  protected getWhoGiftTo() {
    this.whoGiftTo.set({
      allows_write_to_pm: true,
      first_name: 'Iluha',
      language_code: 'ru',
      last_name: 'Test',
      username: 'test',
      id: 123,
      photo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cqMXjTyXdxKBgCpdLMxLB9rHVv_dP5yQekydezkr8gRUfog5ZIXUieQ&s=10'
    })
  }
}

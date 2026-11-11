import { Component, inject } from '@angular/core';
import { Avatar } from '../../components/avatar/avatar';
import { DatePipe } from '@angular/common';
import { GroupContext } from '../../services/group-context';
import { RouterLink } from '@angular/router';

@Component({
  imports: [Avatar, DatePipe, RouterLink],
  selector: 'app-group-overview',
  styleUrl: './group-overview.scss',
  templateUrl: './group-overview.html',
})
export class GroupOverview {
  groupContext = inject(GroupContext);

  gameData = this.groupContext.gameData;
  gameTypeDate = this.groupContext.gameTypeDate;
  isOwner = this.groupContext.isOwner;

  protected setIcon(icon: string): { isUserAvatar: boolean; icon: string } {
    return {
      isUserAvatar: false,
      icon: 'tgGifs/christmasTree.webp',
    };
  }
}

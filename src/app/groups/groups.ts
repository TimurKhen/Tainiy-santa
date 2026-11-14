import { Component, inject, OnInit, signal } from '@angular/core';
import { Group } from '../interfaces/group/group';
import { GroupPreview } from './group-preview/group-preview';
import { GroupPlaceholder } from './group-placeholder/group-placeholder';
import { GroupsHeader } from './groups-header/groups-header';
import { RouterLink } from '@angular/router';
import { BackButton } from '../telegram/backButton/back-button';
import { Game } from '../api/games/game';

@Component({
  imports: [GroupPreview, GroupPlaceholder, GroupsHeader, RouterLink],
  selector: 'app-groups',
  styleUrl: './groups.scss',
  templateUrl: './groups.html',
})
export class Groups implements OnInit {
  private backButton = inject(BackButton);
  private gameService = inject(Game);

  haveGroups = signal<boolean>(true);
  groups = signal<Group[]>([]);
  endedGroups = signal<Group[]>([]);

  ngOnInit() {
    this.backButton.hide();

    this.gameService.getGames().subscribe((v: Group[]) => {
      const active = [];
      const ended = [];

      for (const group of v) {
        if (group.isEnded) {
          ended.push(group)
        } else {
          active.push(group)
        }
      }

      this.groups.set(active)
      this.endedGroups.set(ended)
    })
  }
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Group } from '../interfaces/group/group';
import { GroupPreview } from './group-preview/group-preview';
import { GroupPlaceholder } from './group-placeholder/group-placeholder';
import { GroupsHeader } from './groups-header/groups-header';
import { RouterLink } from '@angular/router';
import { BackButton } from '../telegram/backButton/back-button';
import { Game } from '../api/games/game';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [GroupPreview, GroupPlaceholder, GroupsHeader, RouterLink],
  selector: 'app-groups',
  styleUrl: './groups.scss',
  templateUrl: './groups.html',
})
export class Groups implements OnInit {
  private backButton = inject(BackButton);
  private gameService = inject(Game);

  ngOnInit() {
    this.backButton.hide();
  }

  private allGroups$ = this.gameService.getGames();

  private groupsList = toSignal(this.allGroups$, { initialValue: [] as Group[] });
  groups = computed(() => this.groupsList().filter((g) => !g.isEnded));
  endedGroups = computed(() => this.groupsList().filter((g) => g.isEnded));
  haveGroups = computed(() => this.groupsList().length > 0);
  groupCount = computed(() => this.groupsList().length);
}

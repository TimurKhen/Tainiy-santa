import { Component, computed, inject, OnInit } from '@angular/core';
import { GroupPreview } from './group-preview/group-preview';
import { GroupPlaceholder } from './group-placeholder/group-placeholder';
import { GroupsHeader } from './groups-header/groups-header';
import { RouterLink } from '@angular/router';
import { BackButton } from '../telegram/backButton/back-button';
import { Game } from '../api/games/game';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [GroupPreview, GroupPlaceholder, GroupsHeader, RouterLink, NgTemplateOutlet],
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

  private groupsResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

  isLoading = this.groupsResource.isLoading;
  private groupsList = computed(() => this.groupsResource.value() ?? []);

  groups = computed(() => this.groupsList().filter((g) => !g.is_ended));
  endedGroups = computed(() => this.groupsList().filter((g) => g.is_ended));
  haveGroups = computed(() => this.groupsList().length > 0);
  groupCount = computed(() => this.groupsList().length);
}

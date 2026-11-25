import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { GroupPreview } from './group-preview/group-preview';
import { GroupPlaceholder } from './group-placeholder/group-placeholder';
import { GroupsHeader } from './groups-header/groups-header';
import { RouterLink } from '@angular/router';
import { BackButton } from '../telegram/backButton/back-button';
import { Game } from '../api/games/game';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { timeout } from 'rxjs';

@Component({
  imports: [GroupPreview, GroupPlaceholder, GroupsHeader, RouterLink, NgTemplateOutlet, MatRipple],
  selector: 'app-groups',
  styleUrl: './groups.scss',
  templateUrl: './groups.html',
})
export class Groups implements OnInit {
  private backButton = inject(BackButton);
  private gameService = inject(Game);

  treeLoaded = signal(false);

  ngOnInit() {
    this.backButton.hide();
  }

  private groupsResource = rxResource({
    stream: () => this.gameService.getGames().pipe(timeout({ each: 8000 })),
  });

  isLoading = this.groupsResource.isLoading;
  hasError = computed(() => !this.isLoading() && !!this.groupsResource.error());
  // hasError = computed(() => true);
  private groupsList = computed(() =>
    this.groupsResource.hasValue() ? this.groupsResource.value() : [],
  );

  retry() {
    this.groupsResource.reload();
  }

  groups = computed(() => this.groupsList().filter((g) => !g.is_ended));
  endedGroups = computed(() => this.groupsList().filter((g) => g.is_ended));
  haveGroups = computed(() => this.groupsList().length > 0);
  groupCount = computed(() => this.groupsList().length);
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Group } from '../interfaces/group/group';
import { GroupPreview } from './group-preview/group-preview';
import { GroupPlaceholder } from './group-placeholder/group-placeholder';
import { GroupsHeader } from './groups-header/groups-header';
import { RouterLink } from '@angular/router';
import { BackButton } from '../telegram/backButton/back-button';

@Component({
  imports: [GroupPreview, GroupPlaceholder, GroupsHeader, RouterLink],
  selector: 'app-groups',
  styleUrl: './groups.scss',
  templateUrl: './groups.html',
})
export class Groups implements OnInit {
  private backButton = inject(BackButton);

  haveGroups = signal<boolean>(true);
  groups = signal<Group[]>([
    {
      name: 'Test',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2026, 11, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2026, 11, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: '',
    },
    {
      name: 'Test',
      membersId: [-9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2027, 11, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2027, 5, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: 'test',
    },
    {
      name: 'Test',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2026, 10, 7, 22, 30),
        where: 'У Илюхи',
        money: 100,
        distributionDate: new Date(2026, 10, 1),
      },
      isSelectedGifters: false,
      groupId: '',
      isEnded: false,
      icon: 'test',
    },
  ]);
  endedGroups = signal<Group[]>([
    {
      name: 'Test 2',
      membersId: [-9, 1, 2, 3],
      adminId: -9,
      data: {
        swapDate: new Date(2025, 12, 30),
        distributionDate: new Date(2025, 11, 11),
        where: 'У Илюхи',
        money: 1200,
      },
      isSelectedGifters: true,
      groupId: '',
      isEnded: true,
      icon: 'test',
    },
  ]);

  ngOnInit() {
    this.backButton.hide()
  }
}

import { Routes } from '@angular/router';
import { Groups } from './groups/groups';
import { CreateGroup } from './create-group/create-group';
import { GroupC } from './group/group';
import { GroupOverview } from './group/pages/group-overview/group-overview';
import { GroupSettings } from './group/pages/group-settings/group-settings';

export const routes: Routes = [
  {
    path: '',
    component: Groups,
  },
  {
    path: 'create',
    component: CreateGroup,
  },
  {
    path: 'group/:id',
    component: GroupC,
    children: [
      {
        path: '',
        component: GroupOverview,
      },
      {
        path: 'settings',
        component: GroupSettings,
      },
    ],
  },
];

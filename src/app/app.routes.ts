import { Routes } from '@angular/router';
import { Groups } from './groups/groups';
import { CreateGroup } from './create-group/create-group';
import { GroupC } from './group/group';

export const routes: Routes = [
  {
    path: '',
    component: Groups
  },
  {
    path: 'create',
    component: CreateGroup
  },
  {
    path: 'group/:id',
    component: GroupC
  }
];

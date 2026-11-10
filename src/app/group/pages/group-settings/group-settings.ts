import { Component, inject } from '@angular/core';
import { GroupContext } from '../../services/group-context';

@Component({
  imports: [],
  selector: 'app-group-settings',
  styleUrl: './group-settings.scss',
  templateUrl: './group-settings.html',
})
export class GroupSettings {
  groupContext = inject(GroupContext);

  gameData = this.groupContext.gameData;

}

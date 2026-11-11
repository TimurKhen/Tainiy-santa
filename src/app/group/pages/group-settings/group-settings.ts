import { Component, inject } from '@angular/core';
import { GroupContext } from '../../services/group-context';
import { EditTextInput } from './components/edit-text-input/edit-text-input';

@Component({
  imports: [EditTextInput],
  selector: 'app-group-settings',
  styleUrl: './group-settings.scss',
  templateUrl: './group-settings.html',
})
export class GroupSettings {
  groupContext = inject(GroupContext);

  gameData = this.groupContext.gameData;

  protected readonly String = String;
}

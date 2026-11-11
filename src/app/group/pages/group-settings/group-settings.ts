import { Component, computed, inject } from '@angular/core';
import { GroupContext } from '../../services/group-context';
import { EditTextInput } from './components/edit-text-input/edit-text-input';
import { EditDateInput } from './components/edit-date-input/edit-date-input';

interface SmallInput {
  icon: string;
  label: string;
  value: string;
}

@Component({
  imports: [EditTextInput, EditDateInput],
  selector: 'app-group-settings',
  styleUrl: './group-settings.scss',
  templateUrl: './group-settings.html',
})
export class GroupSettings {
  groupContext = inject(GroupContext);
  gameData = this.groupContext.gameData;

  distribution = computed<SmallInput>(() => {
    const date = this.gameData()!.data.distributionDate;

    return {
      icon: '🎲',
      label: 'Жеребьёвка',
      value: this.formatDate(date),
    };
  });

  exchange = computed<SmallInput>(() => {
    const date = this.gameData()!.data.swapDate;

    return {
      icon: '🎁',
      label: 'Обмен',
      value: this.formatDate(date),
    };
  });

  private formatDate(date: Date): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  updateDates(event: { first: SmallInput; second: SmallInput }) {
    this.groupContext.updateDates(
      this.parseDate(event.first.value),
      this.parseDate(event.second.value),
    );
  }

  private parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  protected readonly String = String;
}

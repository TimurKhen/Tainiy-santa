import { Component, effect, input, output, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface SmallInput {
  icon: string;
  label: string;
  value: string;
}

@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-edit-date-input',
  styleUrl: './edit-date-input.scss',
  templateUrl: './edit-date-input.html',
})
export class EditDateInput {
  icon = input<string>('');
  label = input<string>('');

  first = input.required<SmallInput>();
  second = input.required<SmallInput>();

  valueChange = output<{
    first: SmallInput;
    second: SmallInput;
  }>();

  valueFirst = signal<SmallInput | null>(null);
  valueSecond = signal<SmallInput | null>(null);

  isEditing = signal(false);

  today = signal(
    (() => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().split('T')[0];
    })(),
  );

  constructor() {
    effect(() => {
      this.valueFirst.set({ ...this.first() });
    });

    effect(() => {
      this.valueSecond.set({ ...this.second() });
    });
  }

  protected changeValue() {
    if (!this.isEditing()) {
      this.valueFirst.set({ ...this.first() });
      this.valueSecond.set({ ...this.second() });

      this.isEditing.set(true);
    }
  }

  protected close(event: Event) {
    event.stopPropagation();

    this.valueFirst.set({ ...this.first() });
    this.valueSecond.set({ ...this.second() });

    this.isEditing.set(false);
  }

  protected newValue(event: Event) {
    event.stopPropagation();

    const first = this.valueFirst();
    const second = this.valueSecond();

    if (!first || !second) return;

    this.valueChange.emit({
      first: { ...first },
      second: { ...second },
    });

    this.isEditing.set(false);
  }

  protected checkFirstSecondValue() {
    const firstValue = this.valueFirst()?.value;
    const secondValue = this.valueSecond()?.value;
    const firstDate = new Date(firstValue || '');
    const secondDate = new Date(secondValue || '');

    if (secondDate < firstDate) {
      secondDate.setTime(firstDate.getTime());
      secondDate.setDate(secondDate.getDate() + 1);

      const formattedDate = secondDate.toISOString().split('T')[0];

      this.valueSecond.update((current) => {
        if (!current) return null;

        return {
          ...current,
          value: formattedDate,
        };
      });
    }
  }
}

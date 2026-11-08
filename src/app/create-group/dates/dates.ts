import { Component, effect, input, model, signal } from '@angular/core';
import { TgEmoji } from '../../components/tg-emoji/tg-emoji';
import { DatePipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  imports: [TgEmoji, DatePipe, FormsModule],
  selector: 'app-dates',
  styleUrl: './dates.scss',
  templateUrl: './dates.html',
})
export default class Dates {
  distributionControl = input.required<FormControl<Date | null>>();
  swapControl = input.required<FormControl<Date | null>>();

  distributionDate = model<string | null>(null);
  swapDate = model<string | null>(null);

  today = signal<string>(new Date().toISOString().split('T')[0]);

  constructor() {
    effect(() => {
      const distStr = this.distributionDate();
      const distDate = distStr ? new Date(distStr) : null;

      if (this.distributionControl().value?.getTime() !== distDate?.getTime()) {
        this.distributionControl().setValue(distDate);
        this.distributionControl().markAsTouched();
      }
    });

    effect(() => {
      const swapStr = this.swapDate();
      const swapDate = swapStr ? new Date(swapStr) : null;

      if (this.swapControl().value?.getTime() !== swapDate?.getTime()) {
        this.swapControl().setValue(swapDate);
        this.swapControl().markAsTouched();
      }
    });
  }

  openPicker(input: HTMLInputElement) {
    if (input && 'showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    }
  }
}

import { Component, computed, effect, input, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-dates',
  styleUrl: './dates.scss',
  templateUrl: './dates.html',
})
export default class Dates {
  distributionControl = input.required<FormControl<Date | null>>();
  swapControl = input.required<FormControl<Date | null>>();

  distributionDate = model<string | null>(null);
  swapDate = model<string | null>(null);

  minDistributionDate = signal<string>(this.addDaysToLocalDate(new Date(), 1));
  maxDistributionDate = computed<string | null>(() => {
    return this.swapDate() || null;
  });
  private minSwapDefault = signal<string>(this.addDaysToLocalDate(new Date(), 2));
  minSwapDate = computed<string>(() => {
    const distStr = this.distributionDate();
    if (!distStr) {
      return this.minSwapDefault();
    }

    const baseDate = this.parseDateString(distStr);
    return this.addDaysToLocalDate(baseDate, 1);
  });

  constructor() {
    effect(() => {
      const minSwap = this.minSwapDate();
      const currentSwap = this.swapDate();

      if (currentSwap && currentSwap < minSwap) {
        this.swapDate.set(minSwap);
      }
    });

    effect(() => {
      const distStr = this.distributionDate();
      const distDate = distStr ? this.parseDateString(distStr) : null;

      if (this.distributionControl().value?.getTime() !== distDate?.getTime()) {
        this.distributionControl().setValue(distDate);
        this.distributionControl().markAsTouched();
      }
    });

    effect(() => {
      const swapStr = this.swapDate();
      const swapDate = swapStr ? this.parseDateString(swapStr) : null;

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

  private parseDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private addDaysToLocalDate(date: Date, days: number): string {
    const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    copy.setDate(copy.getDate() + days);

    const year = copy.getFullYear();
    const month = String(copy.getMonth() + 1).padStart(2, '0');
    const day = String(copy.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

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
  distributionTime = model('12:00');
  swapTime = model('18:00');

  minDistributionDate = signal<string>(this.addDaysToLocalDate(new Date(), 1));
  maxDistributionDate = computed<string | null>(() => this.swapDate() || null);
  private minSwapDefault = signal<string>(this.addDaysToLocalDate(new Date(), 2));
  minSwapDate = computed<string>(() => {
    const distStr = this.distributionDate();
    if (!distStr) return this.minSwapDefault();
    return this.addDaysToLocalDate(this.parseDateString(distStr), 1);
  });

  constructor() {
    effect(() => {
      const minSwap = this.minSwapDate();
      const currentSwap = this.swapDate();
      if (currentSwap && currentSwap < minSwap) this.swapDate.set(minSwap);
    });

    effect(() => {
      const date = this.distributionDate();
      const value = date ? this.combineDateAndTime(date, this.distributionTime()) : null;
      if (this.distributionControl().value?.getTime() !== value?.getTime()) {
        this.distributionControl().setValue(value);
        this.distributionControl().markAsTouched();
      }
    });

    effect(() => {
      const date = this.swapDate();
      const value = date ? this.combineDateAndTime(date, this.swapTime()) : null;
      if (this.swapControl().value?.getTime() !== value?.getTime()) {
        this.swapControl().setValue(value);
        this.swapControl().markAsTouched();
      }
    });
  }

  openPicker(input: HTMLInputElement) {
    if (input && 'showPicker' in HTMLInputElement.prototype) input.showPicker();
  }

  private combineDateAndTime(date: string, time: string): Date {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  private parseDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
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

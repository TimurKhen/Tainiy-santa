import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface SmallInput {
  icon: string;
  label: string;
  value: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return toIso(new Date(y, m - 1, d + days));
};

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

  valueChange = output<{ first: SmallInput; second: SmallInput }>();

  isEditing = signal(false);

  protected firstValue = linkedSignal(() => this.first().value);
  protected secondValue = linkedSignal(() => this.second().value);

  protected today = signal(toIso(new Date()));

  protected firstLocked = computed(() => this.first().value < this.today());
  protected secondLocked = computed(() => this.second().value < this.today());

  protected minSecond = computed(() => {
    const nextDay = this.firstValue() ? addDays(this.firstValue(), 1) : this.today();
    return nextDay > this.today() ? nextDay : this.today();
  });

  protected isValid = computed(() => {
    const first = this.firstValue();
    const second = this.secondValue();
    return !!first && !!second && second > first;
  });

  protected changeValue() {
    if (this.isEditing()) return;
    this.resetDrafts();
    this.isEditing.set(true);
  }

  protected close(event: Event) {
    event.stopPropagation();
    this.resetDrafts();
    this.isEditing.set(false);
  }

  protected newValue(event: Event) {
    event.stopPropagation();
    if (!this.isValid()) return;

    this.valueChange.emit({
      first: { ...this.first(), value: this.firstValue() },
      second: { ...this.second(), value: this.secondValue() },
    });
    this.isEditing.set(false);
  }

  protected onFirstChange(value: string) {
    this.firstValue.set(value);

    if (value && this.secondValue() <= value) {
      this.secondValue.set(addDays(value, 1));
    }
  }

  protected onSecondChange(value: string) {
    this.secondValue.set(value);
  }

  private resetDrafts() {
    this.firstValue.set(this.first().value);
    this.secondValue.set(this.second().value);
  }
}

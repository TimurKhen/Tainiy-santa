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

const parseLocalDate = (value: string): Date | null => {
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeIso = (value: string | null | undefined): string => {
  const parsed = value ? parseLocalDate(value) : null;
  return parsed ? toIso(parsed) : '';
};

const normalizeTime = (value: string | null | undefined, fallback: string): string => {
  const parsed = value ? parseLocalDate(value) : null;
  return parsed ? `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}` : fallback;
};

const addDays = (iso: string, days: number): string => {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day + days);
  return toIso(date);
};

const toDateTimeIso = (date: string, time: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes).toISOString();
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
  maxDate = input<string | null>(null);
  valueChange = output<{ first: SmallInput; second: SmallInput }>();

  isEditing = signal(false);
  protected firstValue = linkedSignal(() => normalizeIso(this.first().value));
  protected secondValue = linkedSignal(() => normalizeIso(this.second().value));
  protected firstTime = linkedSignal(() => normalizeTime(this.first().value, '12:00'));
  protected secondTime = linkedSignal(() => normalizeTime(this.second().value, '18:00'));

  protected today = signal(toIso(new Date()));
  protected tomorrow = computed(() => addDays(this.today(), 1));
  protected dayAfterTomorrow = computed(() => addDays(this.today(), 2));
  private normalizedMax = computed(() => normalizeIso(this.maxDate()) || null);

  protected firstLocked = computed(() => {
    const initial = normalizeIso(this.first().value);
    return !!initial && initial <= this.today();
  });
  protected secondLocked = computed(() => {
    const initial = normalizeIso(this.second().value);
    return !!initial && initial <= this.today();
  });

  protected minFirst = computed(() => this.tomorrow());
  protected maxFirst = computed<string | null>(() => {
    const cap = this.normalizedMax();
    const second = this.secondValue();
    const dayBefore = second ? addDays(second, -1) : null;
    if (cap && dayBefore) return cap < dayBefore ? cap : dayBefore;
    return cap ?? dayBefore;
  });
  protected minSecond = computed(() => {
    const first = this.firstValue();
    const afterFirst = first ? addDays(first, 1) : this.dayAfterTomorrow();
    return afterFirst > this.dayAfterTomorrow() ? afterFirst : this.dayAfterTomorrow();
  });
  protected maxSecond = computed<string | null>(() => this.normalizedMax());

  protected isValid = computed(() => {
    const first = this.firstValue();
    const second = this.secondValue();
    if (!first || !second || second < first || (second === first && this.secondTime() <= this.firstTime())) return false;
    const minF = this.minFirst();
    const maxF = this.maxFirst();
    const minS = this.minSecond();
    const maxS = this.maxSecond();
    if (!this.firstLocked() && minF && first < minF) return false;
    if (maxF && first > maxF) return false;
    if (!this.secondLocked() && minS && second < minS) return false;
    if (maxS && second > maxS) return false;
    return !!this.firstTime() && !!this.secondTime();
  });

  protected changeValue() {
    if (this.isEditing()) return;
    this.resetDrafts();
    this.isEditing.set(true);
  }

  protected openPicker(input: HTMLInputElement) {
    if (input && 'showPicker' in HTMLInputElement.prototype) input.showPicker();
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
      first: { ...this.first(), value: toDateTimeIso(this.firstValue(), this.firstTime()) },
      second: { ...this.second(), value: toDateTimeIso(this.secondValue(), this.secondTime()) },
    });
    this.isEditing.set(false);
  }

  protected onFirstChange(value: string) {
    const max = this.maxFirst();
    const next = max && value > max ? max : value;
    this.firstValue.set(next);
    if (next && (!this.secondValue() || this.secondValue() <= next)) {
      let nextSecond = addDays(next, 1);
      const maxSecond = this.maxSecond();
      if (maxSecond && nextSecond > maxSecond) nextSecond = maxSecond;
      this.secondValue.set(nextSecond);
    }
  }

  protected onSecondChange(value: string) {
    const max = this.maxSecond();
    this.secondValue.set(max && value > max ? max : value);
  }

  private resetDrafts() {
    this.firstValue.set(normalizeIso(this.first().value));
    this.secondValue.set(normalizeIso(this.second().value));
    this.firstTime.set(normalizeTime(this.first().value, '12:00'));
    this.secondTime.set(normalizeTime(this.second().value, '18:00'));
  }
}

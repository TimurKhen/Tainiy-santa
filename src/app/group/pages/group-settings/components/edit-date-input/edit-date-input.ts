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

const normalizeIso = (val: string | null | undefined): string => {
  if (!val) return '';
  // На случай если приходит ISO-строка вроде "2026-11-22T00:00:00.000Z"
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    return val.slice(0, 10);
  }
  const parsed = new Date(val);
  return Number.isNaN(parsed.getTime()) ? '' : toIso(parsed);
};

const addDays = (iso: string, days: number): string => {
  const clean = normalizeIso(iso);
  if (!clean) return '';
  const [y, m, d] = clean.split('-').map(Number);
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

  /** Максимально допустимая дата в формате YYYY-MM-DD (опционально) */
  maxDate = input<string | null>(null);

  valueChange = output<{ first: SmallInput; second: SmallInput }>();

  isEditing = signal(false);

  protected firstValue = linkedSignal(() => normalizeIso(this.first().value));
  protected secondValue = linkedSignal(() => normalizeIso(this.second().value));

  protected today = signal(toIso(new Date()));
  protected tomorrow = computed(() => addDays(this.today(), 1));
  protected dayAfterTomorrow = computed(() => addDays(this.today(), 2));

  private normalizedMax = computed(() => normalizeIso(this.maxDate()) || null);

  protected firstLocked = computed(() => {
    const initialFirst = normalizeIso(this.first().value);
    return !!initialFirst && initialFirst < this.today();
  });

  protected secondLocked = computed(() => {
    const initialSecond = normalizeIso(this.second().value);
    return !!initialSecond && initialSecond < this.today();
  });

  /** Минимум для первой даты: завтра (чтобы не выбрать сегодня/прошлое) */
  protected minFirst = computed(() => this.tomorrow());

  /** Максимум для первой даты: maxDate или (second - 1 день), если second задан */
  protected maxFirst = computed<string | null>(() => {
    const maxCap = this.normalizedMax();
    const currentSecond = this.secondValue();
    const dayBeforeSecond = currentSecond ? addDays(currentSecond, -1) : null;

    if (maxCap && dayBeforeSecond) {
      return maxCap < dayBeforeSecond ? maxCap : dayBeforeSecond;
    }
    return maxCap ?? dayBeforeSecond;
  });

  /** Минимум для второй даты: (first + 1 день) или послезавтра */
  protected minSecond = computed(() => {
    const first = this.firstValue();
    const afterFirst = first ? addDays(first, 1) : this.dayAfterTomorrow();
    return afterFirst > this.dayAfterTomorrow() ? afterFirst : this.dayAfterTomorrow();
  });

  /** Максимум для второй даты: заданный maxDate */
  protected maxSecond = computed<string | null>(() => this.normalizedMax());

  protected isValid = computed(() => {
    const first = this.firstValue();
    const second = this.secondValue();
    if (!first || !second) return false;
    if (second <= first) return false;

    const minF = this.minFirst();
    const maxF = this.maxFirst();
    const minS = this.minSecond();
    const maxS = this.maxSecond();

    if (!this.firstLocked() && minF && first < minF) return false;
    if (maxF && first > maxF) return false;
    if (!this.secondLocked() && minS && second < minS) return false;
    if (maxS && second > maxS) return false;

    return true;
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
    const clean = normalizeIso(value);
    const maxF = this.maxFirst();
    const clampedFirst = maxF && clean > maxF ? maxF : clean;

    this.firstValue.set(clampedFirst);

    if (clampedFirst && (!this.secondValue() || this.secondValue() <= clampedFirst)) {
      let nextSecond = addDays(clampedFirst, 1);
      const maxS = this.maxSecond();
      if (maxS && nextSecond > maxS) {
        nextSecond = maxS;
      }
      this.secondValue.set(nextSecond);
    }
  }

  protected onSecondChange(value: string) {
    const clean = normalizeIso(value);
    const maxS = this.maxSecond();
    const clampedSecond = maxS && clean > maxS ? maxS : clean;

    this.secondValue.set(clampedSecond);
  }

  private resetDrafts() {
    this.firstValue.set(normalizeIso(this.first().value));
    this.secondValue.set(normalizeIso(this.second().value));
  }
}

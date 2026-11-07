import { Component, model, signal } from '@angular/core';
import { TgEmoji } from '../../components/tg-emoji/tg-emoji';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConditionalYearDatePipe } from '../../pipes/datePipeWithCheck/date-pipe-with-check-pipe';

@Component({
  imports: [TgEmoji, DatePipe, FormsModule, ConditionalYearDatePipe],
  selector: 'app-dates',
  styleUrl: './dates.scss',
  templateUrl: './dates.html',
})
export class Dates {
  distributionDate = model<Date | null>(null);
  swapDate = model<Date | null>(null);
  today = signal<string>(new Date().toISOString().split('T')[0]);

  // protected setDistributionDate($event: Event) {
  //   const input = $event.target as HTMLInputElement;
  //   console.log('Выбранная дата:', input.value);
  // }
}

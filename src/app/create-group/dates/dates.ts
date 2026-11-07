import { Component, model, signal } from '@angular/core';
import { TgEmoji } from '../../components/tg-emoji/tg-emoji';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [TgEmoji, DatePipe, FormsModule],
  selector: 'app-dates',
  styleUrl: './dates.scss',
  templateUrl: './dates.html',
})
export class Dates {
  distributionDate = model<string | null>(null);
  swapDate = model<string | null>(null);
  today = signal<string>(new Date().toISOString().split('T')[0]);

  openPicker(input: HTMLInputElement) {
    input.showPicker();
  }
}

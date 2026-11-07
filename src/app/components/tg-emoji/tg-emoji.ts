import { Component, input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  imports: [],
  selector: 'app-tg-emoji',
  styleUrl: './tg-emoji.scss',
  templateUrl: './tg-emoji.html',
})
export class TgEmoji {
  emoji = input.required<string | SafeUrl>()
}

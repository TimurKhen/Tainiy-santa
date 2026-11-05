import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Telegram } from './telegram/telegram';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private tgService = inject(Telegram);

  ngOnInit() {
    this.tgService.ready();
    this.tgService.expand();
  }
}

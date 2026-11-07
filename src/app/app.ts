import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Telegram } from './telegram/telegram';
import { BackButton } from './telegram/backButton/back-button';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private boundHandler = this.handleBackButton.bind(this);

  private tgService = inject(Telegram);
  private backButtonService = inject(BackButton);

  private router = inject(Router);
  private location = inject(Location);

  ngOnInit() {
    this.tgService.ready();
    this.tgService.expand();

    this.backButtonService.onClick(this.boundHandler);
  }

  ngOnDestroy() {
    this.backButtonService.offClick(this.boundHandler);
  }

  private handleBackButton() {
    this.location.back();
  }
}

import { Component, DOCUMENT, inject, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
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
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private themeHandler = () => this.applyTheme();

  ngOnInit() {
    this.tgService.ready();
    this.tgService.expand();

    this.backButtonService.onClick(this.boundHandler);
    this.tgService.tg.onEvent('themeChanged', this.themeHandler);
  }

  ngOnDestroy() {
    this.backButtonService.offClick(this.boundHandler);
    this.tgService.tg.offEvent('themeChanged', this.themeHandler);
  }

  private handleBackButton() {
    this.location.back();
  }

  private applyTheme() {
    const scheme = this.tgService.tg.colorScheme;
    const root = this.document.documentElement;

    this.renderer.removeClass(root, 'tg-light');
    this.renderer.removeClass(root, 'tg-dark');
    this.renderer.addClass(root, `tg-${scheme}`);
  }
}

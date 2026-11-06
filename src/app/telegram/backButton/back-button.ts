import { Service } from '@angular/core';

@Service()
export class BackButton {
  private backButton = window.Telegram.WebApp.BackButton;

  constructor() {}

  get isVisible(): boolean {
    return this.backButton?.isVisible ?? false;
  }

  show(): this {
    console.log('Show back button');
    this.backButton?.show();
    return this;
  }

  hide(): this {
    console.log('Hide back button');
    this.backButton?.hide();
    return this;
  }

  onClick(callback: Function): this {
    this.backButton?.onClick(callback);
    return this;
  }

  offClick(callback: Function): this {
    this.backButton?.offClick(callback);
    return this;
  }
}

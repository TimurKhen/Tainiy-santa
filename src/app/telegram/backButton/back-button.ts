import { Service } from '@angular/core';

@Service()
export class BackButton {
  private backButton = window.Telegram.WebApp.BackButton;

  constructor() {}

  get isVisible(): boolean {
    return this.backButton?.isVisible ?? false;
  }

  show(): this {
    this.backButton?.show();
    return this;
  }

  hide(): this {
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

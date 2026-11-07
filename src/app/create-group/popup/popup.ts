import {
  Component,
  effect,
  ElementRef,
  HostListener,
  input, output,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'vo-popup',
  imports: [],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
})
export class VoPopup {
  isShow = input<boolean>(false);
  closedEvent = output();

  @ViewChild('popupContainer') popupContainerElement!: ElementRef<HTMLElement>;

  @HostListener('document:click', [`$event`])
  onClick(event: MouseEvent) {
    if (event.target === this.popupContainerElement?.nativeElement) {
      this.closedEvent.emit();
    }
  }
}

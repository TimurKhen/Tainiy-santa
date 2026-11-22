import {
  afterRenderEffect,
  Component,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { InvisibleRemoverPipe } from '../../pipes/invisibleRemover/invisible-remover-pipe';

@Component({
  imports: [InvisibleRemoverPipe],
  selector: 'app-nickname',
  styleUrl: './nickname.scss',
  templateUrl: './nickname.html',
})
export class Nickname implements OnDestroy {
  value = input.required<string | null | undefined>();
  align = input<'left' | 'right'>('left');

  private viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private text = viewChild.required<ElementRef<HTMLElement>>('text');

  overflow = signal(false);
  shift = signal(0);
  duration = signal(0);

  private resizeObserver?: ResizeObserver;

  constructor() {
    afterRenderEffect(() => {
      this.value();
      this.align();
      this.measure();

      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.measure());
        this.resizeObserver.observe(this.viewport().nativeElement);
        this.resizeObserver.observe(this.text().nativeElement);
      }
    });
  }

  private measure() {
    const viewportEl = this.viewport().nativeElement;
    const textEl = this.text().nativeElement;

    const viewportWidth = viewportEl.clientWidth;
    const textWidth = textEl.scrollWidth;
    const distance = Math.max(0, textWidth - viewportWidth);

    this.overflow.set(distance > 0);
    this.shift.set(distance);
    this.duration.set(distance / 40 + 3);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}

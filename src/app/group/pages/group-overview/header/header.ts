import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

const DISTANCE = 80;

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-stuck]': 'compact()' },
})
export class Header {
  readonly name = input.required<string>();
  readonly money = input.required<number | string>();
  readonly icon = input<string>('tgGifs/christmasTree.webp');
  readonly canExit = input(true);
  readonly exit = output<void>();

  protected readonly compact = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly sentinel = viewChild.required<ElementRef<HTMLElement>>('sentinel');
  private readonly slot = viewChild.required<ElementRef<HTMLElement>>('slot');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const sentinelEl = this.sentinel().nativeElement;
      const slotEl = this.slot().nativeElement;
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

      let raf = 0;
      let timer: ReturnType<typeof setTimeout>;
      let touching = false;

      const scrolled = () => {
        const stickyTop = parseFloat(getComputedStyle(slotEl).top) || 0;
        return stickyTop - sentinelEl.getBoundingClientRect().top;
      };

      const update = () => {
        raf = 0;
        const p = Math.min(1, Math.max(0, scrolled() / DISTANCE));
        this.host.style.setProperty('--p', p.toFixed(3));
        this.compact.set(p > 0.5);
      };

      const snap = () => {
        if (touching) return;
        const s = scrolled();
        if (s <= 0 || s >= DISTANCE) return;
        window.scrollBy({
          top: s < DISTANCE / 2 ? -s : DISTANCE - s,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      };

      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
        clearTimeout(timer);
        timer = setTimeout(snap, 120);
      };
      const onTouchStart = () => {
        touching = true;
      };
      const onTouchEnd = () => {
        touching = false;
        clearTimeout(timer);
        timer = setTimeout(snap, 120);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });
      update();

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      });
    });
  }
}

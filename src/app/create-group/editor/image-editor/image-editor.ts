import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { VoPopup } from '../../popup/popup';

const MAX_SOURCE_SIDE = 1024;
const OUTPUT_SIZE = 512 / 2;
const MAX_ZOOM = 6;
const CROP_RATIO = 0.6;

type Point = { x: number; y: number };

@Component({
  selector: 'app-avatar-cropper',
  imports: [VoPopup],
  templateUrl: './image-editor.html',
  styleUrl: './image-editor.scss',
})
export class ImageEditor implements OnDestroy {
  imageUrl = signal<string | null>(null);
  imgW = signal(0);
  imgH = signal(0);
  transform = signal({ x: 0, y: 0, s: 1 });
  transformCss = computed(() => {
    const { x, y, s } = this.transform();
    return `translate(${x}px, ${y}px) scale(${s})`;
  });
  isShow = signal(false);
  isLoading = signal(false);
  bgColor = signal('#ffffff');
  outputImage = output<File>();
  outputClose = output<void>();
  isSaving = signal(false);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private img?: HTMLImageElement;
  private viewportSize = 0;
  private minScale = 1;
  private pointers = new Map<number, Point>();
  private cropSize = 0;
  private cropOffset = 0;

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.openPopup();
    } else {
      this.isShow.set(false);
    }
  }

  openPopup() {
    this.resetCropper();
    this.readBgColor();
    this.isShow.set(true);
    this.selectNewFile();
  }

  selectNewFile() {
    if (this.isLoading()) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png, .jpg, .jpeg';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      this.isLoading.set(true);
      try {
        const source = await this.downscale(file);
        this.revokeUrl();
        this.imageUrl.set(URL.createObjectURL(source));
      } catch (e) {
        console.error('Failed to load image', e);
      } finally {
        this.isLoading.set(false);
      }
    };
    input.click();
  }

  onImageLoad(e: Event) {
    const img = e.target as HTMLImageElement;
    this.img = img;
    const V = img.parentElement!.clientWidth;
    this.viewportSize = V;
    this.cropSize = V * CROP_RATIO;
    this.cropOffset = (V - this.cropSize) / 2;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    this.imgW.set(iw);
    this.imgH.set(ih);

    this.minScale = this.cropSize / Math.min(iw, ih);

    const s = Math.max(this.minScale, V / Math.max(iw, ih));
    this.setTransform((V - iw * s) / 2, (V - ih * s) / 2, s);
  }

  onPointerDown(e: PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  onPointerMove(e: PointerEvent) {
    if (!this.pointers.has(e.pointerId)) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const before = this.gesture(rect);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const after = this.gesture(rect);
    const ratio = before.dist > 0 && after.dist > 0 ? after.dist / before.dist : 1;
    this.zoomPan(before.mid, after.mid, ratio);
  }

  onPointerEnd(e: PointerEvent) {
    this.pointers.delete(e.pointerId);
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.zoomPan(p, p, Math.exp(-e.deltaY * 0.0015));
  }

  async save() {
    if (!this.img || this.isSaving()) return;
    this.isSaving.set(true);
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const { x, y, s } = this.transform();
      const side = this.cropSize / s;
      const sx = (this.cropOffset - x) / s;
      const sy = (this.cropOffset - y) / s;

      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = this.bgColor();
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(this.img, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.9));
      if (!blob) return;

      this.outputImage.emit(
        new File([blob], 'image.jpg', { type: 'image/jpeg', lastModified: Date.now() }),
      );
      this.close();
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    this.close();
  }

  clear() {
    this.resetCropper();
  }

  close() {
    this.isShow.set(false);
    this.outputClose.emit();
    this.resetCropper();
  }

  ngOnDestroy() {
    this.resetCropper();
  }

  private gesture(rect: DOMRect) {
    const pts = [...this.pointers.values()]
      .slice(0, 2)
      .map((p) => ({ x: p.x - rect.left, y: p.y - rect.top }));
    const a = pts[0];
    const b = pts[pts.length - 1];
    return {
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      dist: pts.length === 2 ? Math.hypot(a.x - b.x, a.y - b.y) : 0,
    };
  }

  private zoomPan(from: Point, to: Point, ratio: number) {
    const { x, y, s } = this.transform();
    const ns = Math.min(this.minScale * MAX_ZOOM, Math.max(this.minScale, s * ratio));
    const r = ns / s;
    this.setTransform(to.x - (from.x - x) * r, to.y - (from.y - y) * r, ns);
  }

  private setTransform(x: number, y: number, s: number) {
    const min = this.cropOffset;
    const max = this.cropOffset + this.cropSize;
    x = Math.min(min, Math.max(max - this.imgW() * s, x));
    y = Math.min(min, Math.max(max - this.imgH() * s, y));
    this.transform.set({ x, y, s });
  }

  private readBgColor() {
    const v = getComputedStyle(this.host.nativeElement).getPropertyValue('--avatar-bg').trim();
    this.bgColor.set(v || '#ffffff');
  }

  private revokeUrl() {
    const url = this.imageUrl();
    if (url) URL.revokeObjectURL(url);
  }

  private async downscale(file: File): Promise<File> {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SOURCE_SIDE / Math.max(bitmap.width, bitmap.height));

    if (scale === 1) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const isPng = file.type === 'image/png';
    const mime = isPng ? 'image/png' : 'image/jpeg';

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), mime, 0.92),
    );
    return new File([blob], isPng ? 'source.png' : 'source.jpg', { type: mime });
  }

  private resetCropper() {
    this.revokeUrl();
    this.imageUrl.set(null);
    this.img = undefined;
    this.pointers.clear();
    this.isLoading.set(false);
  }
}

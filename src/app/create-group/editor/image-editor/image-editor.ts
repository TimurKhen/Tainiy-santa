import { Component, ElementRef, inject, Input, OnDestroy, output, signal } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from '@luoxiao123/angular-image-cropper';
import { VoPopup } from '../../popup/popup';

const MAX_SOURCE_SIDE = 2048;

@Component({
  selector: 'app-avatar-cropper',
  imports: [ImageCropperComponent, VoPopup],
  templateUrl: './image-editor.html',
  styleUrl: './image-editor.scss',
})
export class ImageEditor implements OnDestroy {
  imageFile = signal<File | undefined>(undefined);
  bgColor = signal('#ffffff');
  isCropping = signal(false);
  isShow = signal(false);
  isLoading = signal(false);
  outputImage = output<File>();
  outputClose = output<void>();
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private croppedBlob: Blob | null = null;

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
        this.imageFile.set(await this.downscale(file));
        this.isCropping.set(true);
      } catch (e) {
        console.error('Failed to load image', e);
      } finally {
        this.isLoading.set(false);
      }
    };
    input.click();
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedBlob = event.blob;
    }
  }

  save() {
    if (this.croppedBlob) {
      this.outputImage.emit(
        new File([this.croppedBlob], 'image.png', { type: 'image/png', lastModified: Date.now() }),
      );
      this.close();
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
    setTimeout(() => {
      this.resetCropper();
    }, 300);
  }

  ngOnDestroy(): void {
    this.resetCropper();
  }

  private readBgColor() {
    const value = getComputedStyle(this.host.nativeElement).getPropertyValue('--avatar-bg').trim();
    this.bgColor.set(value || '#ffffff');
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
    this.isCropping.set(false);
    this.isLoading.set(false);
    this.imageFile.set(undefined);
    this.croppedBlob = null;
  }
}

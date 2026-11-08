import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageEditor } from '../editor/image-editor/image-editor';
import { TgEmoji } from '../../components/tg-emoji/tg-emoji';

type IconItem =
  | { id: string; kind: 'preset'; name: string; src: string }
  | { id: string; kind: 'custom'; file: File; objectUrl: string; src: SafeUrl };

const PRESET_ICONS = ['snowflake', 'snowman', 'gift'];

@Component({
  imports: [ImageEditor, TgEmoji],
  selector: 'app-icon-select',
  styleUrl: './icon-select.scss',
  templateUrl: './icon-select.html',
})
export class IconSelect implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  control = input.required<FormControl<string | File | null>>();

  isCropperOpen = signal(false);
  currentIconIndex = signal(0);

  icons = signal<IconItem[]>(
    PRESET_ICONS.map((name) => ({
      id: `preset-${name}`,
      kind: 'preset' as const,
      name,
      src: `tgGifs/${name}.webp`,
    })),
  );

  ngOnInit() {
    this.onSelectedIcon(0);
  }

  openAvatarUpload() {
    this.isCropperOpen.set(true);
  }

  onCropperClose() {
    this.isCropperOpen.set(false);
  }

  onImageCropped(image: File | Blob) {
    this.isCropperOpen.set(false);

    // Make sure the backend always receives a real File
    const file =
      image instanceof File
        ? image
        : new File([image], `icon-${Date.now()}.webp`, { type: image.type || 'image/webp' });

    const objectUrl = URL.createObjectURL(file);

    this.icons.update((list) => [
      ...list,
      {
        id: `custom-${objectUrl}`,
        kind: 'custom',
        file,
        objectUrl,
        src: this.sanitizer.bypassSecurityTrustUrl(objectUrl),
      },
    ]);

    this.onSelectedIcon(this.icons().length - 1);
  }

  onSelectedIcon(index: number) {
    const item = this.icons()[index];
    if (!item) return;

    this.currentIconIndex.set(index);

    // File for custom icons, preset name for built-in ones
    this.control().setValue(item.kind === 'custom' ? item.file : item.name);
    this.control().markAsTouched();
    this.control().markAsDirty();
  }

  ngOnDestroy() {
    for (const item of this.icons()) {
      if (item.kind === 'custom') {
        URL.revokeObjectURL(item.objectUrl);
      }
    }
  }
}

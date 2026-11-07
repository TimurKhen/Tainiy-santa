import { Component, output, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageEditor } from '../editor/image-editor/image-editor';
import { TgEmoji } from '../../components/tg-emoji/tg-emoji';
import { Router } from '@angular/router';

@Component({
  imports: [ImageEditor, TgEmoji],
  selector: 'app-icon-select',
  styleUrl: './icon-select.scss',
  templateUrl: './icon-select.html',
})
export class IconSelect {
  avatarImage: File | null = null;
  isCropperOpen = false;

  currentIconIndex = signal<number>(0);
  changeIcon = output<string | SafeUrl>();

  icons = signal<string[] | SafeUrl[]>(['snowflake', 'snowman', 'gift']);

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  openAvatarUpload() {
    this.isCropperOpen = true;
  }

  onImageCropped(imageUrl: File) {
    this.avatarImage = imageUrl;
    this.isCropperOpen = false;

    this.onFileSelected(imageUrl);
  }

  onFileSelected(file: File) {
    if (file) {
      const unsafeUrl = URL.createObjectURL(file);
      const imagePath = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
      this.icons.update((v) => [...v, imagePath]);
      this.onSelectedIcon(this.icons().length - 1)
    }
  }

  onCropperClose() {
    this.isCropperOpen = false;
  }

  onSelectedIcon(id: number) {
    this.currentIconIndex.set(id);
    this.changeIcon.emit(this.icons()[id]);
  }

  protected updatePath(item: string | SafeUrl): string | SafeUrl {
    if (typeof item === 'string') {
      return `tgGifs/${item}.webp`;
    } else {
      return item
    }
  }
}

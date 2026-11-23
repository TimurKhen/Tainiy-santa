import { Component, input, inject, OnInit, output, computed, signal } from '@angular/core';
import { MeResponse } from '../../../api/user/user';
import { Nickname } from '../../../components/nickname/nickname';
import { BackButton } from '../../../telegram/backButton/back-button';
import { Telegram } from '../../../telegram/telegram';

const AVATAR_COLORS = [
  '#e17076',
  '#eda86c',
  '#a695e7',
  '#7bc862',
  '#6ec9cb',
  '#65aadd',
  '#ee7aae',
  '#f2a05b',
];

@Component({
  imports: [Nickname],
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
  currentUserId = input.required<number>();
  user = input.required<any>();
  isOwner = input<boolean>(false);
  isOpen = input<boolean>(false);

  toggle = output<void>();
  makeAdmin = output<any>();
  removeUser = output<any>();

  fullName = computed(() => {
    const u = this.user();
    return `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
  });
  isCurrentUser = computed(() => this.currentUserId() === this.user().id);

  private failedUrl = signal<string | null>(null);

  showImage = computed(() => {
    const url = this.user().photo_url;
    return !!url && this.failedUrl() !== url;
  });

  onAvatarClick(event: Event) {
    if (!this.isOwner() || this.isCurrentUser()) return;
    event.stopPropagation();
    this.toggle.emit();
  }

  onMakeAdmin(event: Event) {
    event.stopPropagation();
    const ok = window.confirm(`Назначить ${this.fullName()} организатором?`);
    if (!ok) return;
    this.makeAdmin.emit(this.user());
    this.toggle.emit();
  }

  onDelete(event: Event) {
    event.stopPropagation();
    const ok = window.confirm(`Удалить ${this.fullName()} из группы?`);
    if (!ok) return;
    this.removeUser.emit(this.user());
    this.toggle.emit();
  }

  initial = computed(() => {
    const u = this.user();
    const source = (u.first_name || u.last_name || u.username || '?').trim();
    return source.charAt(0).toUpperCase();
  });

  bgColor = computed(() => {
    const u = this.user();
    const key = String(u.id ?? this.fullName());
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  });

  onImageError() {
    this.failedUrl.set(this.user().photo_url);
  }
}

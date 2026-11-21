import { Component, input, inject, OnInit, output, computed } from '@angular/core';
import { MeResponse } from '../../../api/user/user';
import { Nickname } from '../../../components/nickname/nickname';
import { BackButton } from '../../../telegram/backButton/back-button';
import { Telegram } from '../../../telegram/telegram';

@Component({
  imports: [Nickname],
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
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

  onAvatarClick(event: Event) {
    if (!this.isOwner()) return;
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
}

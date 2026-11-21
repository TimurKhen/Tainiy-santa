import { Component, input, inject, OnInit } from '@angular/core';
import { MeResponse } from '../../../api/user/user';
import { Nickname } from '../../../components/nickname/nickname';
import { BackButton } from '../../../telegram/backButton/back-button';

@Component({
  imports: [Nickname],
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar implements OnInit {
  private backButton = inject(BackButton);

  isOwner = input.required<boolean>();
  user = input.required<MeResponse>();

  ngOnInit() {
    this.backButton.show();
  }
}

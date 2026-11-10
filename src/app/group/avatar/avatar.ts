import { Component, input, inject, OnInit, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../api/user/user';
import { Nickname } from '../../components/nickname/nickname';
import { BackButton } from '../../telegram/backButton/back-button';

@Component({
  imports: [Nickname],
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar implements OnInit {
  private userService = inject(UserService);
  private backButton = inject(BackButton);

  isOwner = input.required<boolean>();
  userId = input.required<number>();

  userResource = rxResource({
    params: () => ({ id: this.userId() }),
    stream: ({ params }) => this.userService.getUserById(params.id),
  });

  user = computed(() => (this.userResource.hasValue() ? this.userResource.value() : undefined));

  ngOnInit() {
    this.backButton.show();
  }
}

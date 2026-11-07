import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';
import { DatePipe, NgPlural, NgPluralCase } from '@angular/common';
import { TypeDateService } from './type-date-service';
import { ConditionalYearDatePipe } from '../../pipes/datePipeWithCheck/date-pipe-with-check-pipe';

@Component({
  imports: [DatePipe, NgPluralCase, NgPlural, ConditionalYearDatePipe],
  selector: 'app-group-preview',
  templateUrl: './group-preview.html',
  styleUrl: './group-preview.scss',
})
export class GroupPreview implements OnInit {
  typeDateService = inject(TypeDateService);

  data = input.required<Group>();
  protected readonly isOwner = signal<boolean>(true);

  protected getUserAvatar(userId: number) {
    return 'https://i.pinimg.com/236x/5f/6c/3c/5f6c3cc8d9074f47ca871aaa5e1d168b.jpg';
  }

  protected setIcon(icon: string): { isUserAvatar: boolean; icon: string } {
    if (icon.length > 0) {
      return {
        isUserAvatar: true,
        icon: this.getUserAvatar(1),
      };
    } else {
      return {
        isUserAvatar: false,
        icon: 'tgGifs/christmasTree.webp',
      };
    }
  }

  ngOnInit() {
    this.checkUser();
  }

  checkUser() {}

  getTypeDate() {
    return this.typeDateService.isDistributionEnded(this.data());
  }
}

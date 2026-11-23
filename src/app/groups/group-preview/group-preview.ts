import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';
import { DatePipe, NgPlural, NgPluralCase } from '@angular/common';
import { TypeDateService } from './type-date-service';
import { RouterLink } from '@angular/router';
import { ShortNumberPipe } from '../../pipes/short-number-pipe/short-number-pipe';
import { environment } from '../../../environments/environment';
import { Nickname } from '../../components/nickname/nickname';
import { Telegram } from '../../telegram/telegram';

@Component({
  imports: [DatePipe, NgPluralCase, NgPlural, RouterLink, ShortNumberPipe, Nickname],
  selector: 'app-group-preview',
  templateUrl: './group-preview.html',
  styleUrl: './group-preview.scss',
})
export class GroupPreview implements OnInit {
  typeDateService = inject(TypeDateService);
  private tgService = inject(Telegram)

  data = input.required<Group>();
  protected readonly isOwner = signal<boolean>(false);

  protected setIcon(icon: string): { isUserAvatar: boolean; icon: string } {
    if (icon === 'tree' || icon === 'snowman' || icon === 'nonoice') {
      return {
        isUserAvatar: false,
        icon: `tgSvg/${icon}.svg`,
      };
    } else {
      return {
        isUserAvatar: true,
        icon: this.data().icon,
      };
    }
  }

  ngOnInit() {
    this.checkUser();
  }

  checkUser() {
    if (this.tgService.user.id === this.data().admin_id) {
      this.isOwner.set(true);
    } else {
      this.isOwner.set(false);
    }
  }

  getTypeDate() {
    const v = this.typeDateService.isDistributionEnded(this.data());
    console.log(v);
    return v;
  }
}

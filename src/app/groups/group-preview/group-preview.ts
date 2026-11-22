import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';
import { DatePipe, NgPlural, NgPluralCase } from '@angular/common';
import { TypeDateService } from './type-date-service';
import { RouterLink } from '@angular/router';
import { ShortNumberPipe } from '../../pipes/short-number-pipe/short-number-pipe';
import { environment } from '../../../environments/environment';

@Component({
  imports: [DatePipe, NgPluralCase, NgPlural, RouterLink, ShortNumberPipe],
  selector: 'app-group-preview',
  templateUrl: './group-preview.html',
  styleUrl: './group-preview.scss',
})
export class GroupPreview implements OnInit {
  typeDateService = inject(TypeDateService);

  data = input.required<Group>();
  protected readonly isOwner = signal<boolean>(true);

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

  checkUser() {}

  getTypeDate() {
    const v = this.typeDateService.isDistributionEnded(this.data());
    console.log(v)
    return v
  }
}

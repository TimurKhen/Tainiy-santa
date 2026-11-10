import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TypeDateService } from '../groups/group-preview/type-date-service';
import { Game } from '../api/games/game';
import { Group } from '../interfaces/group/group';
import { Avatar } from './avatar/avatar';

@Component({
  imports: [DatePipe, Avatar],
  selector: 'app-group',
  styleUrl: './group.scss',
  templateUrl: './group.html',
})
export class GroupC implements OnInit {
  typeDateService = inject(TypeDateService);
  gameService = inject(Game);
  @Input() id!: string;
  gameTypeDate = signal<{ type: string; date: Date } | null>(null);
  gameData = signal<Group | null>(null);
  protected readonly isOwner = signal<boolean>(true);

  ngOnInit() {
    this.request();
  }

  request() {
    this.gameService.getGame().subscribe((game) => {
      this.gameData.set(game);
      this.getTypeDate(game);
    });
  }

  getTypeDate(game: Group) {
    this.gameTypeDate.set(this.typeDateService.isDistributionEnded(game));
  }

  protected setIcon(icon: string): { isUserAvatar: boolean; icon: string } {
    return {
      isUserAvatar: false,
      icon: 'tgGifs/christmasTree.webp',
    };
  }
}

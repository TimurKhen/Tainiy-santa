import { Component, computed, inject, signal } from '@angular/core';
import { GroupContext } from '../../services/group-context';
import { EditTextInput } from './components/edit-text-input/edit-text-input';
import { EditDateInput } from './components/edit-date-input/edit-date-input';
import { Game } from '../../../api/games/game';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface SmallInput {
  icon: string;
  label: string;
  value: string;
}

@Component({
  imports: [EditTextInput, EditDateInput],
  selector: 'app-group-settings',
  styleUrl: './group-settings.scss',
  templateUrl: './group-settings.html',
})
export class GroupSettings {
  private groupContext = inject(GroupContext);
  private gameService = inject(Game);

  constructor(private router: Router, private location: Location) {}

  gameData = this.groupContext.gameData;

  private draftDates = signal<{ distribution: string; swap: string } | null>(null);
  private draftMoney = signal<number | null>(null);
  private draftWhere = signal<string | null>(null);

  protected isSaving = signal(false);

  distribution = computed<SmallInput>(() => {
    const date = this.draftDates()?.distribution ?? this.gameData()!.distribution_date;
    return { icon: '🎲', label: 'Жеребьёвка', value: date };
  });

  exchange = computed<SmallInput>(() => {
    const date = this.draftDates()?.swap ?? this.gameData()!.swap_date;
    return { icon: '🎁', label: 'Обмен', value: date };
  });

  updateDates(event: { first: SmallInput; second: SmallInput }) {
    this.draftDates.set({
      distribution: event.first.value,
      swap: event.second.value,
    });
  }

  updateMoney(value: string) {
    this.draftMoney.set(parseInt(value));
  }
  updateWhere(value: string) {
    this.draftWhere.set(value);
  }

  save() {
    const game = this.gameData();
    if (!game || this.isSaving()) return;

    const dates = this.draftDates();
    const settings = {
      money: this.draftMoney() ?? game.money,
      where: this.draftWhere() ?? game.place,
      distributionDate: dates?.distribution ?? game.distribution_date,
      swapDate: dates?.swap ?? game.swap_date,
    };

    this.isSaving.set(true);

    this.gameService
      .changeSettings(
        game.id,
        settings.money,
        settings.distributionDate,
        settings.swapDate,
        settings.where,
      )
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.groupContext.updateSettings(settings);
          this.draftDates.set(null);
          this.draftMoney.set(null);
          this.draftWhere.set(null);

          this.location.back();
        },
        error: () => {
          alert('Не удалось сохранить настройки');
        },
      });
  }

  private parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  protected deleteGroup() {
    const isConfirmed = confirm('Вы уверены, что хотите удалить эту игру?');

    if (isConfirmed) {
      this.gameService.deleteGame(this.groupContext.gameData()?.id || -1);
      this.router.navigate(['/']);
    }
  }

  protected readonly String = String;
}

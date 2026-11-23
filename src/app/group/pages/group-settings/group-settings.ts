import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { GroupContext } from '../../services/group-context';
import { EditTextInput } from './components/edit-text-input/edit-text-input';
import { EditDateInput } from './components/edit-date-input/edit-date-input';
import { Game } from '../../../api/games/game';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Telegram } from '../../../telegram/telegram';
import { BackButton } from '../../../telegram/backButton/back-button';

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
export class GroupSettings implements OnInit {
  private groupContext = inject(GroupContext);
  private gameService = inject(Game);
  private backButtonService = inject(BackButton);

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.backButtonService.show();
  }

  gameData = this.groupContext.gameData;

  private draftDates = signal<{ distribution: string; swap: string } | null>(null);
  private draftMoney = signal<number | null>(null);
  private draftWhere = signal<string | null>(null);

  private isInputFocused = signal(false);
  private isViewportShrunk = signal(false);

  protected isSaving = signal(false);
  protected isTyping = computed(() => this.isInputFocused() || this.isViewportShrunk());

  distribution = computed<SmallInput>(() => {
    const date = this.draftDates()?.distribution ?? this.gameData()!.distribution_date;
    return { icon: '🎲', label: 'Жеребьёвка', value: date };
  });

  exchange = computed<SmallInput>(() => {
    const date = this.draftDates()?.swap ?? this.gameData()!.swap_date;
    return { icon: '🎁', label: 'Обмен', value: date };
  });

  protected hasChanges = computed(() => {
    const game = this.gameData();
    if (!game) return false;

    const money = this.draftMoney() ?? game.money;
    const place = this.draftWhere() ?? game.place;
    const dates = this.draftDates();
    const distributionDate = dates?.distribution ?? game.distribution_date;
    const swapDate = dates?.swap ?? game.swap_date;

    return (
      money !== game.money ||
      place !== game.place ||
      distributionDate !== game.distribution_date ||
      swapDate !== game.swap_date
    );
  });

  updateDates(event: { first: SmallInput; second: SmallInput }) {
    this.draftDates.set({
      distribution: event.first.value,
      swap: event.second.value,
    });
  }

  updateMoney(value: string) {
    const trimmed = value.trim().replace(/\D/g, '');
    if (!trimmed) {
      this.draftMoney.set(null);
      return;
    }
    const parsed = Number(trimmed);
    this.draftMoney.set(Number.isNaN(parsed) ? null : parsed);
  }

  updateWhere(value: string) {
    this.draftWhere.set(value);
  }

  save() {
    const game = this.gameData();
    if (!this.hasChanges()) {
      this.location.back();
      return;
    }
    if (!game || this.isSaving()) return;

    const dates = this.draftDates();
    const updatedGroup = {
      ...game,
      money: this.draftMoney() ?? game.money,
      place: this.draftWhere() ?? game.place,
      distribution_date: dates?.distribution ?? game.distribution_date,
      swap_date: dates?.swap ?? game.swap_date,
    };

    this.isSaving.set(true);

    this.gameService
      .changeSettings(updatedGroup)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.groupContext.updateSettings({
            money: updatedGroup.money,
            where: updatedGroup.place,
            distributionDate: updatedGroup.distribution_date,
            swapDate: updatedGroup.swap_date,
          });
          this.draftDates.set(null);
          this.draftMoney.set(null);
          this.draftWhere.set(null);

          this.groupContext.ensureLoaded(this.gameData()?.id!, true).subscribe({
            error: (err) => console.error('Не удалось обновить данные группы:', err),
          });
          this.location.back();
          return;
        },
        error: () => {
          alert('Не удалось сохранить настройки');
        },
      });
  }

  protected deleteGroup() {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту игру?');

    if (isConfirmed) {
      this.gameService.deleteGame(this.groupContext.gameData()?.id || -1).subscribe(() => {
        this.router.createUrlTree(['/']);
      });
    }
  }

  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent) {
    if (this.isTextInput(event.target)) {
      this.isInputFocused.set(true);
    }
  }

  @HostListener('focusout')
  onFocusOut() {
    queueMicrotask(() => {
      const active = document.activeElement;
      this.isInputFocused.set(this.isTextInput(active));
    });
  }

  private isTextInput(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    if (target instanceof HTMLTextAreaElement) return true;
    if (target instanceof HTMLInputElement) {
      const nonTextTypes = [
        'checkbox',
        'radio',
        'range',
        'file',
        'button',
        'submit',
        'reset',
        'color',
      ];
      return !nonTextTypes.includes(target.type);
    }
    return false;
  }

  protected readonly String = String;
}

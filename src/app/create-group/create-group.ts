import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconSelect } from './icon-select/icon-select';
import { GiftBudget } from './gift-budget/gift-budget';
import { BackButton } from '../telegram/backButton/back-button';
import Dates from './dates/dates';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { Game } from '../api/games/game';
import { Location } from '@angular/common';
import { MatRipple } from '@angular/material/core';

@Component({
  imports: [ReactiveFormsModule, IconSelect, GiftBudget, Dates, MatRipple],
  selector: 'app-create-group',
  styleUrl: './create-group.scss',
  templateUrl: './create-group.html',
})
export class CreateGroup {
  private backButton = inject(BackButton);
  private gameService = inject(Game);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  private scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

  isInputFocused = signal<boolean>(false);

  createForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
    budget: new FormControl<number>(1000, [Validators.required, Validators.max(1_000_000)]),
    distributionDate: new FormControl<Date | null>(null, [Validators.required]),
    swapDate: new FormControl<Date | null>(null, [Validators.required]),
    icon: new FormControl<string | File>('', [Validators.required]),
    place: new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
  });

  readonly isValid = toSignal(
    this.createForm.statusChanges.pipe(
      startWith(this.createForm.status),
      map((status) => status === 'VALID'),
    ),
    { initialValue: this.createForm.valid },
  );

  isCreating = signal<boolean>(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.scrollTimeoutId) {
        clearTimeout(this.scrollTimeoutId);
      }
    });
  }

  onInputFocus(inputEl: HTMLElement) {
    this.isInputFocused.set(true);

    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
    }

    this.scrollTimeoutId = setTimeout(() => {
      inputEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }, 250);
  }

  onInputBlur() {
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }

    setTimeout(() => {
      const active = document.activeElement;
      const stillInInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA';
      this.isInputFocused.set(Boolean(stillInInput));
    }, 50);
  }

  onCreate(event: Event) {
    event.preventDefault();

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);

    const values = this.createForm.value as {
      name: string;
      budget: number;
      distributionDate: Date | null;
      swapDate: Date | null;
      icon: string | File;
      place: string;
    };

    this.gameService.createGame(values).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.location.back();
      },
      error: (err) => {
        console.error(err);
        this.isCreating.set(false);
        alert('Неизвестная ошибка создания группы');
      },
    });
  }

  ngOnInit() {
    this.backButton.show();
  }
}

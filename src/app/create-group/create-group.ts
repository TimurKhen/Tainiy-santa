import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconSelect } from './icon-select/icon-select';
import { GiftBudget } from './gift-budget/gift-budget';
import { BackButton } from '../telegram/backButton/back-button';
import Dates from './dates/dates';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { Game } from '../api/games/game';
import { Location } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, IconSelect, GiftBudget, Dates, Dates],
  selector: 'app-create-group',
  styleUrl: './create-group.scss',
  templateUrl: './create-group.html',
})
export class CreateGroup {
  private backButton = inject(BackButton);
  private gameService = inject(Game);
  private location = inject(Location);

  createForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    budget: new FormControl<number>(1, [Validators.required]),
    distributionDate: new FormControl<Date | null>(null, [Validators.required]),
    swapDate: new FormControl<Date | null>(null, [Validators.required]),
    icon: new FormControl<string | File>('', [Validators.required]),
    place: new FormControl<string>('', [Validators.required]),
  });

  readonly isValid = toSignal(
    this.createForm.statusChanges.pipe(
      startWith(this.createForm.status),
      map((status) => status === 'VALID'),
    ),
    { initialValue: this.createForm.valid },
  );

  isCreating = signal<boolean>(false);

  onCreate(event: Event) {
    event.preventDefault();
    this.isCreating.set(true);

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const values = this.createForm.value as {
      name: string;
      budget: number;
      distributionDate: Date | null;
      swapDate: Date | null;
      icon: string | File;
      place: string;
    };

    this.gameService.createGame(values).subscribe({
      next: (response) => {
        console.log(response);
        this.isCreating.set(false);
        this.location.back();
      },
      error: (err) => {
        console.error(err);
        this.isCreating.set(false);
        alert('Неизвестная ошибка создания группы')
      },
    });
  }

  ngOnInit() {
    this.backButton.show();
  }
}

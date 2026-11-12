import { Component, inject, ViewChild } from '@angular/core';
import { ImageEditor } from './editor/image-editor/image-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TgEmoji } from '../components/tg-emoji/tg-emoji';
import { IconSelect } from './icon-select/icon-select';
import { GiftBudget } from './gift-budget/gift-budget';
import { BackButton } from '../telegram/backButton/back-button';
import Dates from './dates/dates';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  imports: [
    ReactiveFormsModule,
    IconSelect,
    GiftBudget,
    Dates,
    Dates,
  ],
  selector: 'app-create-group',
  styleUrl: './create-group.scss',
  templateUrl: './create-group.html',
})
export class CreateGroup {
  private backButton = inject(BackButton);

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

  onCreate(event: Event) {
    event.preventDefault();
    const { icon } = this.createForm.getRawValue();

    alert(icon instanceof File);
    if (icon instanceof File) {
      alert([icon.name, icon.type, icon.size]);
    } else {
      alert(icon); // 'snowflake' | 'snowman' | 'gift'
    }
  }

  ngOnInit() {
    this.backButton.show();
  }
}

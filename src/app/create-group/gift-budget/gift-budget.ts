import { Component, ElementRef, input, model, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';

@Component({
  imports: [FormsModule, MatRipple],
  selector: 'app-gift-budget',
  styleUrl: './gift-budget.scss',
  templateUrl: './gift-budget.html',
})
export class GiftBudget {
  control = input.required<FormControl<number | null>>();

  selectedId = signal<number>(0);
  isSelectedUserPrice = signal<boolean>(false);
  userPrice = model<number>(0);
  prices = signal<(number | string)[]>([1000, 3000, 5000, 'Своя сумма']);

  @ViewChild('userPriceInput') userPriceInput!: ElementRef;

  selectId(id: number) {
    if (id === 3) {
      this.isSelectedUserPrice.set(true);
      setTimeout(() => {
        this.userPriceInput.nativeElement.focus();
      }, 100);
    } else {
      this.isSelectedUserPrice.set(false);
      this.control().setValue(<number>this.prices()[id]);
    }
    this.selectedId.set(id);
    this.control().markAsTouched();
  }

  validatePrice(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);
    const max = 1_000_000;

    if (value > max) {
      this.userPrice.set(max);
      input.value = String(max);
    }

    this.control().setValue(<number>this.userPrice());
  }
}

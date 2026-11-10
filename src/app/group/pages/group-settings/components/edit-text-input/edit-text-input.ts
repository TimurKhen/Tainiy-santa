import { Component, effect, ElementRef, input, model, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-edit-text-input',
  styleUrl: './edit-text-input.scss',
  templateUrl: './edit-text-input.html',
})
export class EditTextInput {
  icon = input<string>('');
  label = input<string>('');
  valueInput = model<string>('');

  value = signal<string>('');
  isEditing = signal<boolean>(false);

  control = input<FormControl<any>>();

  @ViewChild('inputElement') inputEl!: ElementRef;

  constructor() {
    effect(() => {
      this.value.set(this.valueInput());
    });
  }

  protected changeValue() {
    if (!this.isEditing()) {
      this.isEditing.set(true);
      setTimeout(() => {
        this.inputEl.nativeElement.focus();
      }, 200);
    }
  }

  protected close($event: PointerEvent) {
    $event.stopPropagation();
    this.isEditing.set(false);
    this.inputEl.nativeElement.blur();
  }

  protected newValue($event: PointerEvent | null) {
    if ($event) $event.stopPropagation();
    this.isEditing.set(false);
    this.inputEl.nativeElement.blur();
    console.log('new Value');
  }
}

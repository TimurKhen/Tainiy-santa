import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-edit-text-input',
  styleUrl: './edit-text-input.scss',
  templateUrl: './edit-text-input.html',
})
export class EditTextInput {
  icon = input<string>('');
  label = input<string>('');
  valueInput = input<string>('');

  valueChange = output<string>();

  value = signal<string>('');
  isEditing = signal<boolean>(false);

  private inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  private snapshot = '';

  constructor() {
    effect(() => this.value.set(this.valueInput()));
  }

  protected changeValue() {
    if (this.isEditing()) return;

    this.snapshot = this.value();
    this.isEditing.set(true);
    setTimeout(() => this.inputEl().nativeElement.focus(), 200);
  }

  protected close(event: Event) {
    event.stopPropagation();
    this.value.set(this.snapshot);
    this.finishEditing();
  }

  protected newValue(event: Event | null) {
    event?.stopPropagation();
    this.valueChange.emit(this.value());
    this.finishEditing();
  }

  private finishEditing() {
    this.isEditing.set(false);
    this.inputEl().nativeElement.blur();
  }

  protected scrollToCenter(event: Event) {
    const el = event.target as HTMLElement;
    setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 100);
  }
}

import { Component, ViewChild } from '@angular/core';
import { ImageEditor } from './editor/image-editor/image-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TgEmoji } from '../components/tg-emoji/tg-emoji';
import { IconSelect } from './icon-select/icon-select';

@Component({
  imports: [ImageEditor, ReactiveFormsModule, TgEmoji, IconSelect],
  selector: 'app-create-group',
  styleUrl: './create-group.scss',
  templateUrl: './create-group.html',
})
export class CreateGroup {
  createForm = new FormGroup({
    name: new FormControl<string>('', [Validators.email, Validators.required]),
    budget: new FormControl<number>(1, [Validators.required]),
    distributionDate: new FormControl<Date | null>(null, [Validators.required]),
    swapDate: new FormControl<Date | null>(null, [Validators.required]),
    icon: new FormControl<string | File>('', [Validators.required]),
  });

  onCreate(event: Event) {
    event.preventDefault();

    if (this.createForm.valid) {
      const formValues = this.createForm.getRawValue();

      // const userData: RegistrationData = {
      //   ...(formValues as RegistrationData),
      //   avatar: this.avatarImage,
      // };

      // this.userService.register(userData).subscribe((data) => {
      //   console.log(data);
      //   this.router.navigate(['/']);
      // });
    }
  }
}

import { Component, ViewChild } from '@angular/core';
import { ImageEditor } from './editor/image-editor/image-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  imports: [ImageEditor, ReactiveFormsModule],
  selector: 'app-create-group',
  styleUrl: './create-group.scss',
  templateUrl: './create-group.html',
})
export class CreateGroup {
  @ViewChild('avatarCropper') avatarCropper!: ImageEditor;
  createForm = new FormGroup({
    name: new FormControl<string>('', [Validators.email, Validators.required]),
    budget: new FormControl<number>(1, [Validators.required]),
    distributionDate: new FormControl<Date | null>(null, [Validators.required]),
    swapDate: new FormControl<Date | null>(null, [Validators.required]),
  });
  avatarImage: File | null = null;
  avatarImagePath: SafeUrl | null = null;
  isCropperOpen = false;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  openAvatarUpload() {
    this.isCropperOpen = true;
  }

  onImageCropped(imageUrl: File) {
    this.avatarImage = imageUrl;
    this.isCropperOpen = false;

    this.onFileSelected(imageUrl);
  }

  onFileSelected(file: File) {
    if (file) {
      const unsafeUrl = URL.createObjectURL(file);
      this.avatarImagePath = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
    }
  }

  onCropperClose() {
    this.isCropperOpen = false;
  }

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

import { Component, Input, OnDestroy, OnInit, output, signal } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper'
import { VoPopup } from '../../popup/popup'

@Component({
  selector: 'app-avatar-cropper',
  imports: [ImageCropperComponent, VoPopup],
  templateUrl: './image-editor.html',
  styleUrl: './image-editor.scss',
})
export class ImageEditor implements OnDestroy {
  @Input() set isOpen(value: boolean) {
    if (value) {
      this.openPopup()
    } else {
      this.isShow.set(false)
    }
  }

  imageChangedEvent: Event | null = null
  croppedImage: SafeUrl = ''
  imageObject: any = null

  isCropping = signal<boolean>(false)
  isShow = signal<boolean>(false)

  outputImage = output<any>()
  outputClose = output<void>()

  constructor(private sanitizer: DomSanitizer) {}

  openPopup() {
    this.selectNewFile()
    this.isShow.set(true)
    this.isCropping.set(false)
    this.imageChangedEvent = null
  }

  selectNewFile() {
    this.triggerFileInput()
  }

  private triggerFileInput() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.png, .jpg, .jpeg'
    fileInput.onchange = (event: any) => {
      if (event.target.files && event.target.files[0]) {
        this.fileChangeEvent(event)
        this.isCropping.set(true)
      }
    }
    fileInput.click()
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob && event.objectUrl) {
      this.imageObject = event.blob;
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
  }

  imageLoaded(image: LoadedImage) {
  }

  save() {
    if (this.imageObject) {
      const imageFile = new File([this.imageObject], 'image.png', {
        type: 'image/png',
        lastModified: Date.now()
      })
      this.outputImage.emit(imageFile)
      this.close()
    }
  }

  cancel() {
    this.close()
  }

  clear() {
    this.resetCropper()
  }

  private close() {
    this.isShow.set(false)
    this.outputClose.emit()
    this.resetCropper()
  }

  private resetCropper() {
    this.isCropping.set(false)
    this.imageChangedEvent = null
    this.croppedImage = ''
    this.imageObject = null
  }

  ngOnDestroy(): void {
    this.resetCropper()
  }
}
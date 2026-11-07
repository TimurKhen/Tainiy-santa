import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageEditorService {
  isOpen = signal(false)
  imageCropped$ = new Subject<string>()
  
  openCropper() {
    this.isOpen.set(true)
  }
  
  closeCropper() {
    this.isOpen.set(false)
  }
  
  emitCroppedImage(image: string) {
    this.imageCropped$.next(image)
    this.closeCropper()
  }
}

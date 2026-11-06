import { Component, input } from '@angular/core';

@Component({
  selector: 'vo-popup',
  imports: [],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
})
export class VoPopup {
  isShow = input<boolean>(false)
}

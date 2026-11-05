import { Component, input } from '@angular/core';
import { NgPlural, NgPluralCase } from '@angular/common';

@Component({
  imports: [NgPlural, NgPluralCase],
  selector: 'app-groups-header',
  styleUrl: './groups-header.scss',
  templateUrl: './groups-header.html',
})
export class GroupsHeader {
  groupCount = input.required<number>();
}

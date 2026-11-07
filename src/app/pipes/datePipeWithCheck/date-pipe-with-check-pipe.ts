import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'datePipeWithCheck',
})
export class ConditionalYearDatePipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(
    value: any,
    currentYearFormat: string = 'MMMM d',
    otherYearFormat: string = 'MMMM d, yyyy',
  ): any {
    if (!value) return '';

    const targetYear = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();

    const format = targetYear === currentYear ? currentYearFormat : otherYearFormat;

    return this.datePipe.transform(value, format);
  }
}

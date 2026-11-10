import { Pipe, PipeTransform } from '@angular/core';

const FILLERS =
  /[\u034F\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u2060-\u206F\u2800\u3164\uFFA0]/g;

@Pipe({
  name: 'invisibleRemover',
})
export class InvisibleRemoverPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return (value ?? '')
      .replace(FILLERS, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHyphens'
})
export class RemoveHyphensPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.replace(/-/g, ' ');
    }
    return value;
  }
}


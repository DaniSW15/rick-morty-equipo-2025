import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue',
  standalone: true
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: any, defaultText: string = 'No existe'): string {
    if (value === null || value === undefined || value === '') {
      return defaultText;
    }
    return value;
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue',
  standalone: true
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: any, defaultValue: string = '-'): string {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }

    if (typeof value === 'string') {
      return value.trim() === '' ? defaultValue : value;
    }

    if (Array.isArray(value)) {
      return value.length === 0 ? defaultValue : value.join(', ');
    }

    return value.toString();
  }
}

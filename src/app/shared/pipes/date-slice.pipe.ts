import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSlice'
})

export class DateSlicePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.slice(0, 10);
  }
}

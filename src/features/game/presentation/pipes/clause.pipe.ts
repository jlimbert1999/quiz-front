import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clause',
  standalone: true,
})
export class ClausePipe implements PipeTransform {
  transform(value: number): unknown {
    return String.fromCharCode(97 + value);
  }
}

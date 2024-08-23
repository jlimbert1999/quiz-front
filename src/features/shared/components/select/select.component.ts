import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [BrnSelectImports, HlmSelectImports],
  template: `
    <brn-select class="inline-block" [placeholder]="placeholder()">
      <hlm-select-trigger class="w-56">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        @for (item of items(); track $index) {
        <hlm-option [value]="item">{{ item }}</hlm-option>
        }
      </hlm-select-content>
    </brn-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  items = input.required<string[]>();
  placeholder = input<string>('Select an option');
  onSelect = output<string>();
}

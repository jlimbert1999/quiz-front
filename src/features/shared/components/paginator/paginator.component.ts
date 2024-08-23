import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [
    CommonModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,
  ],
  template: `
    <div class="flex flex-col justify-between mt-4 sm:flex-row sm:items-center">
      <span class="text-sm text-muted-foreground text-sm"
        >{{ offset() }} of {{ length() }} row(s) selected</span
      >
      <div class="flex mt-2 sm:mt-0">
        <!-- <brn-select class="inline-block">
          <hlm-select-trigger class="inline-flex mr-1 w-15 h-9">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content>
            @for (size of sizes(); track size) {
            <hlm-option [value]="size"> </hlm-option>
            }
          </hlm-select-content>
        </brn-select> -->

        <div class="flex space-x-1">
          <button size="sm" variant="outline" hlmBtn (click)="back()">
            Previous
          </button>
          <button size="sm" variant="outline" hlmBtn (click)="next()">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  sizes = input<number[]>([10, 20, 40, 50]);
  limit = input.required<number>();
  length = input.required<number>();

  onPageChange = output<{ limit: number; offset: number }>();
  index = signal<number>(0);
  offset = computed(() => this.limit() * this.index());

  next() {
    if (this.offset() >= this.length()) return;
    this.index.update((value) => (value += 1));
    this.onPageChange.emit({ offset: this.offset(), limit: this.limit() });
  }

  back() {
    if (this.index() <= 0) return;
    this.index.update((value) => (value -= 1));
    this.onPageChange.emit({ offset: this.offset(), limit: this.limit() });
  }
}

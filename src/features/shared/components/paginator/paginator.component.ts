import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
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
    <div class="flex p-2 flex-col justify-between sm:flex-row sm:items-center">
      <span class="text-sm text-muted-foreground text-sm"> {{ offset() }} - {{length()}}</span>
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
  length = input.required<number>();
  limit = input.required<number>();
  pageSizeOptions = input<number[]>([]);
  index = model.required<number>();

  onPageChange = output<{ pageSize: number; pageOffset: number }>();

  offset = computed(() => this.index() * this.limit());
  remainig = computed(() => this.length() - this.offset());

  next() {
    if (this.limit() >= this.remainig()) return;
    this.index.update((value) => (value += 1));
    this.onPageChange.emit({
      pageSize: this.limit(),
      pageOffset: this.index(),
    });
  }

  back() {
    if (this.index() === 0) return;
    this.index.update((value) => (value -= 1));
    this.onPageChange.emit({
      pageSize: this.limit(),
      pageOffset: this.index(),
    });
  }
}

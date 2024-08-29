import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgForOf } from '@angular/common';
import { ReplaySubject } from 'rxjs';

import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';

import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import {
  lucideChevronsUpDown,
  lucideCheck,
  lucideSearch,
} from '@ng-icons/lucide';

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmFormFieldModule,
    BrnCommandImports,
    HlmCommandImports,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    HlmInputDirective,
    NgForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck }),
  ],
  template: `
    <brn-popover
      [state]="state()"
      (stateChanged)="stateChanged($event)"
      sideOffset="5"
      closeDelay="100"
    >
      <button
        class="w-full justify-between"
        variant="outline"
        brnPopoverTrigger
        hlmBtn
      >
        {{ currentSuggestion() ?? placeholder() }}
      </button>
      <brn-cmd
        *brnPopoverContent="let ctx"
        hlmPopoverContent
        hlm
        class="p-0 w-[280px]"
      >
        <hlm-cmd-input-wrapper>
          <hlm-icon name="lucideSearch" />
          <input
            [formControl]="bankFilterCtrl"
            placeholder="Ingrese el termino a buscar"
            brnCmdInput
            hlm
            (keyup.enter)="state.set('closed')"
          />
        </hlm-cmd-input-wrapper>
        <brn-cmd-list hlm>
          <brn-cmd-group hlm>
            <button
              *ngFor="let suggestion of filteredBanks | async"
              brnCmdItem
              [value]="suggestion"
              (selected)="commandSelected(suggestion)"
              hlm
            >
              {{ suggestion }}
            </button>
          </brn-cmd-group>
        </brn-cmd-list>
      </brn-cmd>
    </brn-popover>
  `,
})
export class AutocompleteComponent<T> implements OnInit {
  private destroyRef = inject(DestroyRef);
  placeholder = input('Buscar elemento');
  options = input.required<string[]>();
  async = input<boolean>(false);

  onFilter = output<string | null>();
  onSelect = output<T>();

  public currentSuggestion = model<string | undefined>(undefined);
  public bankFilterCtrl = new FormControl<string>('');
  public filteredBanks = new ReplaySubject<string[]>(1);
  public state = signal<'closed' | 'open'>('closed');

  constructor() {
    effect(() => {
      this.filteredBanks.next(this.options());
    });
  }

  ngOnInit(): void {
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.onFilter.emit(value);
        this.currentSuggestion.set(value ?? undefined);
        if (!this.async()) return this.filterBanks();
      });
  }

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(suggestion: string) {
    this.state.set('closed');
    this.currentSuggestion.set(suggestion);
    this.onFilter.emit(suggestion);
  }

  protected filterBanks() {
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.options().slice());
      return;
    }
    this.filteredBanks.next(
      this.options().filter(
        (bank) => bank.toLowerCase().indexOf(search!.toLowerCase()) > -1
      )
    );
  }
}

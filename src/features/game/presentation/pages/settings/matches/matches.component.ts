import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { MatchComponent } from './match/match.component';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, HlmIconComponent],
  templateUrl: './matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucidePlus })],
})
export class MatchesComponent {
  private readonly _hlmDialogService = inject(HlmDialogService);
  datasource = signal<any[]>([]);
  datasize = signal<number>(0);
  limit = signal<number>(10);
  offset = signal<number>(0);

  create(): void {
    const dialogRef = this._hlmDialogService.open(MatchComponent, {
      contentClass: 'sm:min-w-[750px]',
    });
    dialogRef.closed$.subscribe((game?: any) => {
      if (!game) return;
      this.datasource.update((values) => [game, ...values]);
    });
  }

  update(game: any): void {
    const dialogRef = this._hlmDialogService.open(MatchComponent, {
      contentClass: 'sm:!max-w-[750px]',
      context: { game },
    });
    dialogRef.closed$.subscribe((question?: any) => {
      // if (!question) return;
      // this.datasource.update((values) => {
      //   const index = values.findIndex(({ _id }) => _id === question._id);
      //   values[index] = question;
      //   return [...values];
      // });
    });
  }
}

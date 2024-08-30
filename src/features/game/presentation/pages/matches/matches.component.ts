import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import {
  lucideLayoutDashboard,
  lucidePencil,
  lucidePlay,
  lucidePlus,
  lucideSettings,
  lucideSettings2,
} from '@ng-icons/lucide';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';

import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '@spartan-ng/ui-tooltip-helm';

import { gameResponse } from '../../../infrastructure';
import { GameService } from '../../services';
import { MatchService } from '../../services/match.service';
import { MatchComponent } from './match/match.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HlmButtonModule,
    HlmIconComponent,
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    BrnTooltipContentDirective,
  ],
  templateUrl: './matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucidePlay, lucideSettings2, lucidePlus })],
})
export class MatchesComponent implements OnInit {
  private gameService = inject(GameService);
  private matchService = inject(MatchService);
  private router = inject(Router);
  private readonly _hlmDialogService = inject(HlmDialogService);

  matches = signal<gameResponse[]>([]);

  ngOnInit(): void {
    this.matchService.getPendings().subscribe((data) => {
      console.log(data);
      this.matches.set(data);
    });
  }

  startGame(game: gameResponse, route: string) {
    localStorage.setItem('match', game._id);
    this.router.navigateByUrl('/game/play');
  }

  create(): void {
    const dialogRef = this._hlmDialogService.open(MatchComponent, {
      contentClass: 'sm:min-w-[550px]',
    });
    dialogRef.closed$.subscribe((match?: gameResponse) => {
      if (!match) return;
      this.matches.update((values) => [match, ...values]);
    });
  }
}

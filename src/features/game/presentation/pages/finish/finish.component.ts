import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatchService, TransmisionService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-finish',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center justify-center h-screen relative overflow-hidden"
    >
      <div class="absolute inset-0 confetti">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        class="flex flex-col items-center space-y-4 justify-center animate-victory"
      >
        <img
          src="../../../assets/trofeo.png"
          alt="Winner"
          class="h-48 text-center"
        />
        <h1 class="text-4xl font-bold text-orange-500 mb-4">
          ¡Felicidades, {{ winner().name }}!
        </h1>
        <p class="text-3xl font-bold text-orange-700">
          Puntaje: {{ winner().score }}
        </p>
        <div class="mt-6"></div>
      </div>
    </div>
  `,
  styleUrl: './finish.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinishComponent implements OnInit {
  private matchservice = inject(MatchService);
  private transmisionService = inject(TransmisionService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  winner = signal({ name: '', score: 0 });

  constructor() {
    this._listenNewMatches();
  }

  ngOnInit(): void {
    this._getResuts();
  }

  private _getResuts() {
    this.route.params
      .pipe(switchMap(({ id }) => this.matchservice.getMatchResult(id)))
      .subscribe((match) => {
        if (match.player1.score > match.player2.score) {
          this.winner.set(match.player1);
        } else {
          this.winner.set(match.player2);
        }
        this.matchservice.playAudio('winner');
      });
  }

  private _listenNewMatches() {
    this.transmisionService
      .listenNewMatch()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.router.navigateByUrl('/game/play');
      });
  }
}

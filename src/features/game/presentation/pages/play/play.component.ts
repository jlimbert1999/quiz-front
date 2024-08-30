import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { questionResponse } from '../../../infrastructure';
import { TransmisionService, MatchService } from '../../services';
import { ClausePipe } from '../../pipes/clause.pipe';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, ClausePipe],
  templateUrl: './play.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `


@keyframes fall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}

@keyframes flash {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-fall {
  animation: fall 2s linear infinite;
}

.animate-flash {
  animation: flash 0.5s ease-out;
}

  `,
})
export class PlayComponent implements OnInit {
  private transmisionService = inject(TransmisionService);
  private matchService = inject(MatchService);
  private timerSubscription?: Subscription;
  private router = inject(Router);

  match = signal(this.matchService.currentMatch()!);

  question = signal<questionResponse | undefined>(
    this.matchService.currentMatch()?.currentQuestion
  );

  isOptionsDisplayed = signal<boolean>(false);
  selectedIndex = signal<number | null>(null);
  remainingTime = signal<number>(60);

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime() > 0) {
        this.remainingTime.update((values) => (values -= 1));
      } else {
        this.stopTimer();
      }
    });
  }
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  constructor() {
    this._listenNextQuestion();
    this._listenDisplayOptions();
    this._listenAnswerQuestion();
    this._listenScore1();
    this._listenScore2();
    this.lisntewWinner()
  }

  text = signal<string>('Esperando');

  ngOnInit(): void {}

  private _listenNextQuestion() {
    this.stopTimer();
    this.transmisionService
      .listenNextQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((question) => {
        this.isOptionsDisplayed.set(false);
        this.selectedIndex.set(null);
        this.remainingTime.set(60);
        this.match.update((values) => ({
          ...values,
          currentQuestion: question,
        }));
      });
  }

  private _listenDisplayOptions() {
    this.transmisionService
      .listenDisplayOptions()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.startTimer();
        this.isOptionsDisplayed.set(true);
      });
  }

  private _listenAnswerQuestion() {
    this.transmisionService
      .listenAnswerQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((index) => {
        this.stopTimer();
        this.selectedIndex.set(index);
      });
  }

  private _listenScore1() {
    this.transmisionService.listenScore1().subscribe((score) => {
      this.match.update((values) => {
        values.player1.score = score;
        return { ...values };
      });
    });
  }

  private lisntewWinner() {
    this.transmisionService.listenWinner().subscribe(() => {
      this.router.navigateByUrl('//game/winner');
    });
  }

  private _listenScore2() {
    this.transmisionService.listenScore2().subscribe((score) => {
      this.match.update((values) => {
        values.player2.score = score;
        return { ...values };
      });
    });
  }

  esOpcionPequena(opcion: any): boolean {
    const textoCorto = opcion.texto && opcion.texto.length < 30;
    const sinImagen = !opcion.imagen;
    return textoCorto || sinImagen;
  }
}

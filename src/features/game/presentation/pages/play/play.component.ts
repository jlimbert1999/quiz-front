import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { interval, Subscription, takeWhile, tap } from 'rxjs';

import { questionResponse } from '../../../infrastructure';
import { TransmisionService, MatchService } from '../../services';
import { ClausePipe } from '../../pipes/clause.pipe';
import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, ClausePipe],
  templateUrl: './play.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
})
export class PlayComponent implements OnInit {
  private router = inject(Router);
  private transmisionService = inject(TransmisionService);
  private matchService = inject(MatchService);

  match = signal(this.matchService.currentMatch()!);
  question = signal<questionResponse | undefined>(
    this.matchService.currentMatch()?.currentQuestion
  );
  selectedIndex = signal<number | null>(null);

  private timer$: Subscription | null = null;
  timeLeft = signal<number>(this.match().timer);

  constructor() {
    this._listenNextQuestion();
    this._listenDisplayOptions();
    this._listenAnswerQuestion();
    this._listenScore();
    this._listenWinner();
    this._listenSettings();
  }

  ngOnInit(): void {
  }

  private _listenNextQuestion() {
    this.transmisionService
      .listenNextQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((question) => {
        this.stopTimer();
        this.selectedIndex.set(null);
        this.timeLeft.set(this.match().timer);
        this.match.update((values) => ({
          ...values,
          status: 'pending',
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
        this.match.update((values) => ({
          ...values,
          status: 'selected',
        }));
      });
  }

  private _listenAnswerQuestion() {
    this.matchService.stopAudio();
    this.transmisionService
      .listenAnswerQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((index) => {
        this.stopTimer();
        this.selectedIndex.set(index);
        const selectedOption = this.match().currentQuestion?.options[index];
        this.matchService.stopAudio();
        this.matchService.playAudio(
          selectedOption?.isCorrect ? 'correct' : 'wrong'
        );
      });
  }

  private _listenScore() {
    this.transmisionService.listenScore().subscribe((data) => {
      this.match.update((values) => {
        if (data.player === 'player1') {
          values.player1.score = data.score;
        } else {
          values.player2.score = data.score;
        }
        return { ...values };
      });
    });
  }

  private _listenWinner() {
    this.transmisionService
      .listenWinner()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.router.navigateByUrl(`/finish/${this.match()._id}`);
      });
  }

  private _listenSettings() {
    this.transmisionService
      .listenSettings()
      .pipe(takeUntilDestroyed())
      .subscribe((settings) => {
        this.timeLeft.set(settings.timer);
        this.match.update((values) => {
          values.incrementBy = settings.incrementBy;
          values.timer = settings.timer;
          return { ...values };
        });
      });
  }

  startTimer(): void {
    this.matchService.playAudio('clock', true);
    this.timer$ = interval(1000)
      .pipe(
        tap(() => {
          if (this.timeLeft() === 0) {
            this.stopTimer()
          }
        }),
        takeWhile(() => this.timeLeft() > 0)
      )
      .subscribe(() => {
        this.timeLeft.update((value) => (value -= 1));
      });
  }

  stopTimer(): void {
    this.matchService.stopAudio();
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }
}

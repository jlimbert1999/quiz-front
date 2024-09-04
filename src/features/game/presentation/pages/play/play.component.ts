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
import { interval, Subscription } from 'rxjs';

import { questionResponse } from '../../../infrastructure';
import { TransmisionService, MatchService } from '../../services';
import { ClausePipe } from '../../pipes/clause.pipe';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, ClausePipe],
  templateUrl: './play.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  remainingTime = signal<number>(this.match().timer);

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
    this._listenScore();
    this._listenWinner();
  }

  text = signal<string>('Esperando');

  ngOnInit(): void {}

  private _listenNextQuestion() {
    this.transmisionService
      .listenNextQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((question) => {
        this.stopTimer();
        this.selectedIndex.set(null);
        this.isOptionsDisplayed.set(false);
        this.remainingTime.set(this.match().timer);
        this.match.update((values) => ({
          ...values,
          currentQuestion: question,
        }));
      });
  }

  private _listenDisplayOptions() {
    this.matchService.playSound('clock');
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
        const selectedOption = this.match().currentQuestion?.options[index];
        this.matchService.playSound(
          selectedOption?.isCorrect ? 'answer' : 'error'
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
    this.transmisionService.listenWinner().subscribe(() => {
      this.router.navigateByUrl('/game/winner');
    });
  }

  esOpcionPequena(opcion: any): boolean {
    const textoCorto = opcion.texto && opcion.texto.length < 30;
    const sinImagen = !opcion.imagen;
    return textoCorto || sinImagen;
  }
}

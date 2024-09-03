import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective,
} from '@spartan-ng/ui-card-helm';

import {
  GameService,
  QuestionService,
  TransmisionService,
} from '../../services';
import { MatchService } from '../../services/match.service';
import { ClausePipe } from '../../pipes/clause.pipe';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,

    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmIconComponent,
    ClausePipe,
    HlmInputDirective,
  ],
  templateUrl: './control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucidePlus, lucideMinus })],
})
export class ControlComponent {
  private questionService = inject(QuestionService);
  private matchService = inject(MatchService);
  private transmisionService = inject(TransmisionService);

  currentGroup = signal<string>('');
  groups = toSignal(this.questionService.getGroups(), { initialValue: [] });
  match = signal(this.matchService.currentMatch()!);

  isOptionsDisplayed = signal<boolean>(false);
  isAnswered = signal<boolean>(false);
  selectedIndex = signal<number | null>(null);

  incrementIn = signal<number>(10);

  constructor() {}

  getRandomQuestion(): void {
    // if (this.currentGroup() === '' || !this.match().currentQuestion) return;

    this.isAnswered.set(false);
    this.selectedIndex.set(null);
    this.isOptionsDisplayed.set(false);
    this.matchService
      .getNextQuestion(this.match()._id, this.currentGroup())
      .subscribe((question) => {
        this.match.update((values) => ({
          ...values,
          currentQuestion: question,
        }));
      });
  }

  showOptions() {
    this.isOptionsDisplayed.set(true);
    this.transmisionService.showQuestionOptions(this.match()._id);
  }

  answer(index: number) {
    if (this.isAnswered()) return;
    this.isAnswered.set(true);
    this.selectedIndex.set(index);
    this.matchService.answerQuestion(this.match()._id, index).subscribe();
  }

  addScorePlayer1() {
    this.matchService
      .score1(this.match()._id, this.incrementIn())
      .subscribe(({ score }) => {
        this.match.update((values) => {
          values.player1.score = score;
          return { ...values };
        });
      });
  }

  addScorePlayer2() {
    this.matchService
      .score2(this.match()._id, this.incrementIn())
      .subscribe(({ score }) => {
        this.match.update((values) => {
          values.player2.score = score;
          return { ...values };
        });
      });
  }

  removeScorePlayer1() {
    if (this.match().player1.score <= 0) {
      return;
    }
    this.matchService
      .score1(this.match()._id, -this.incrementIn())
      .subscribe(({ score }) => {
        this.match.update((values) => {
          values.player1.score = score;
          return { ...values };
        });
      });
  }

  removeScorePlayer2() {
    if (this.match().player2.score <= 0) {
      return;
    }
    this.matchService
      .score2(this.match()._id, -this.incrementIn())
      .subscribe(({ score }) => {
        this.match.update((values) => {
          values.player2.score = score;
          return { ...values };
        });
      });
  }

  winner() {
    this.transmisionService.showwinner(this.match()._id);
  }
}

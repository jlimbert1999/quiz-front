import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import {
  lucideArrowRight,
  lucideCheck,
  lucideEye,
  lucideListRestart,
  lucideMinus,
  lucidePlus,
  lucideSettings,
} from '@ng-icons/lucide';

import { QuestionService, MatchService } from '../../services';
import { ClausePipe } from '../../pipes/clause.pipe';
import {
  BrnDialogTriggerDirective,
  BrnDialogContentDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmToasterComponent } from '@spartan-ng/ui-helm-helm';
import { toast } from 'ngx-sonner';
import {
  BrnAlertDialogTriggerDirective,
  BrnAlertDialogContentDirective,
} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogTitleDirective,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogContentComponent,
} from '@spartan-ng/ui-alertdialog-helm';
import { interval, Subscription, takeWhile } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,
    HlmIconComponent,
    ClausePipe,
    HlmInputDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmToasterComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
  ],
  templateUrl: './control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideEye,
      lucidePlus,
      lucideCheck,
      lucideMinus,
      lucideSettings,
      lucideArrowRight,
      lucideListRestart,
    }),
  ],
})
export class ControlComponent {
  private formBuilder = inject(FormBuilder);
  private matchService = inject(MatchService);
  private questionService = inject(QuestionService);
  private router = inject(Router);

  group = signal<string>('');
  groups = toSignal(this.questionService.getGroups(), { initialValue: [] });
  match = signal(this.matchService.currentMatch()!);

  selectedIndex = signal<number | null>(null);
  formMatch: FormGroup = this.formBuilder.group({
    incrementBy: [
      this.match().incrementBy,
      [Validators.required, Validators.min(1)],
    ],
    timer: [this.match().timer, [Validators.required, Validators.min(1)]],
  });

  private timer$: Subscription | null = null;
  timeLeft = signal<number>(this.match().timer);

  getRandomQuestion(): void {
    if (this.group() === '') return;
    this.stopTimer();
    this.selectedIndex.set(null);
    this.timeLeft.set(this.match().timer);

    this.matchService
      .getNextQuestion(this.match()._id, this.group())
      .subscribe((question) => {
        this.match.update((values) => ({
          ...values,
          status: 'pending',
          currentQuestion: question,
        }));
      });
  }

  showQuestionOptions(): void {
    if (this.match().status === 'selected' || !this.match().currentQuestion) {
      return;
    }
    this.startTimer();
    this.matchService
      .showQuestionOptions(this.match()._id)
      .subscribe(({ status }) => {
        this.match.update((values) => ({ ...values, status }));
      });
  }

  answerQuestions(index: number): void {
    if (this.selectedIndex() !== null) return;
    this.stopTimer();
    this.selectedIndex.set(index);
    this.matchService.answerQuestion(this.match()._id, index).subscribe();
  }

  updateScore(player: 'player1' | 'player2', operation: 'add' | 'remove') {
    this.matchService
      .updateScore(this.match()._id, player, operation)
      .subscribe(({ score }) => {
        this.match.update((values) => {
          if (player === 'player1') {
            values.player1.score = score;
          } else {
            values.player2.score = score;
          }
          return { ...values };
        });
      });
  }

  updateMatchSettings(): void {
    this.matchService
      .updateMatchSettings(this.match()._id, this.formMatch.value)
      .subscribe(({ timer, incrementBy }) => {
        this.timeLeft.set(timer);
        this.match.update((values) => {
          values.incrementBy = incrementBy;
          values.timer = timer;
          return { ...values };
        });
      });
  }

  restartQuestions(context: any) {
    this.matchService.restartQuestions().subscribe(({ message }) => {
      toast.success(message, { duration: 3000 });
      context.close();
    });
  }

  endMatch() {
    this.matchService.endMatch(this.match()._id).subscribe(() => {
      this.router.navigateByUrl(`/start`);
    });
  }

  startTimer(): void {
    this.timer$ = interval(1000)
      .pipe(takeWhile(() => this.timeLeft() > 0))
      .subscribe(() => {
        this.timeLeft.update((value) => (value -= 1));
      });
  }

  stopTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }
}

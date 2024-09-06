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
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective,
} from '@spartan-ng/ui-card-helm';

import { QuestionService, TransmisionService } from '../../services';
import { MatchService } from '../../services/match.service';
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

    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
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
  providers: [provideIcons({ lucidePlus, lucideMinus })],
})
export class ControlComponent {
  private formBuilder = inject(FormBuilder);
  private questionService = inject(QuestionService);
  private matchService = inject(MatchService);
  private transmisionService = inject(TransmisionService);

  group = signal<string>('');
  groups = toSignal(this.questionService.getGroups(), { initialValue: [] });
  match = signal(this.matchService.currentMatch()!);

  isAnswered = signal<boolean>(false);
  selectedIndex = signal<number | null>(null);

  matchConfigForm: FormGroup = this.formBuilder.group({
    incrementBy: [
      this.match().incrementBy,
      [Validators.required, Validators.min(1)],
    ],
    timer: [this.match().timer, [Validators.required, Validators.min(1)]],
  });

  getRandomQuestion(): void {
    if (this.group() === '') return;
    this.isAnswered.set(false);
    this.selectedIndex.set(null);
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
    if (this.match().status === 'selected') return;
    this.matchService
      .showQuestionOptions(this.match()._id)
      .subscribe(({ status }) => {
        this.match.update((values) => ({ ...values, status }));
      });
  }

  answer(index: number) {
    if (this.isAnswered()) return;
    this.isAnswered.set(true);
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

  updateSettings() {
    this.matchService
      .updateSettings(this.match()._id, this.matchConfigForm.value)
      .subscribe(({ timer, incrementBy }) => {
        this.match.update((values) => {
          values.incrementBy = incrementBy;
          values.timer = timer;
          return { ...values };
        });
      });
  }

  winner() {
    this.transmisionService.showwinner(this.match()._id);
  }

  restartQuestions(context: any) {
    this.matchService.restartQuestions().subscribe(({ message }) => {
      toast.success(message, { duration: 3000 });
      context.close();
    });
  }
}

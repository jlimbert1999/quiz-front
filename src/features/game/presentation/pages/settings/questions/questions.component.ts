import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  TrackByFunction,
} from '@angular/core';

import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucidePlus,
  lucideMoveHorizontal,
  lucideMoveVertical,
  lucideMenu,
  lucidePencil,
} from '@ng-icons/lucide';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import {
  HlmButtonDirective,
  HlmButtonModule,
} from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

import { QuestionComponent } from './question/question.component';
import { FormsModule } from '@angular/forms';
import {
  HlmCheckboxCheckIconComponent,
  HlmCheckboxComponent,
} from '@spartan-ng/ui-checkbox-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import {
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { SelectionModel } from '@angular/cdk/collections';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { QuestionService } from '../../../services';
import { questionResponse } from '../../../../infrastructure';
import { PaginatorComponent } from '../../../../../shared';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    CommonModule,
    HlmIconComponent,
    HlmButtonDirective,
    HlmIconComponent,

    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,

    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,

    BrnSelectModule,
    HlmSelectModule,
    PaginatorComponent,
  ],
  templateUrl: './questions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideMoveVertical,
      lucidePlus,
      lucideMenu,

      lucidePencil,
    }),
  ],
  host: {
    class: 'w-full',
  },
})
export class QuestionsComponent implements OnInit {
  private questionService = inject(QuestionService);
  private readonly _hlmDialogService = inject(HlmDialogService);

  datasource = signal<questionResponse[]>([]);
  datasize = signal<number>(0);
  limit = signal<number>(10);
  offset = signal<number>(0);

  constructor() {}

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions() {
    this.questionService
      .getQuestions({ limit: this.limit(), offset: this.offset() })
      .subscribe(({ length, questions }) => {
        this.datasource.set(questions);
        this.datasize.set(length);
      });
  }

  create(): void {
    const dialogRef = this._hlmDialogService.open(QuestionComponent, {
      contentClass: 'sm:!max-w-[750px]',
    });
    dialogRef.closed$.subscribe((question?: questionResponse) => {
      if (!question) return;
      this.datasource.update((values) => [question, ...values]);
    });
  }

  update(question: questionResponse): void {
    const dialogRef = this._hlmDialogService.open(QuestionComponent, {
      contentClass: 'sm:!max-w-[750px]',
      context: { question },
    });
    dialogRef.closed$.subscribe((question?: questionResponse) => {
      if (!question) return;
      this.datasource.update((values) => [question, ...values]);
    });
  }

  changepage(params: { offset: number; limit: number }) {
    this.limit.set(params.limit);
    this.offset.set(params.offset);
    this.getQuestions();
  }
}

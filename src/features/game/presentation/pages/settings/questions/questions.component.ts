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

import { lucidePlus, lucidePencil, lucideUpload } from '@ng-icons/lucide';
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

import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';

import { QuestionService } from '../../../services';
import { questionResponse } from '../../../../infrastructure';
import { PaginatorComponent } from '../../../../../shared';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

interface uploadData {
  text: string;
  group: string;
  options: { text: string; isCorrect: boolean }[];
}
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
    HlmBadgeDirective,
  ],
  templateUrl: './questions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucidePlus,
      lucidePencil,
      lucideUpload,
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
      this.datasource.update((values) => {
        const index = values.findIndex(({ _id }) => _id === question._id);
        values[index] = question;
        return [...values];
      });
    });
  }

  changepage(params: { pageSize: number; pageOffset: number }) {
    this.limit.set(params.pageSize);
    this.offset.set(params.pageOffset);
    this.getQuestions();
  }

  async loadExcelFile() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo a cargar',
      text: 'Formatos permitidos :ods, csv, xlsx',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        accept:
          '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Cargar archivo excel',
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const wb = read(reader.result, {
          type: 'binary',
          cellDates: true,
        });
        const uploadData: uploadData[] = [];
        wb.SheetNames.forEach((sheet) => {
          const data = utils.sheet_to_json<any>(wb.Sheets[sheet]);
          data.forEach((el) => {
            if (el['PREGUNTA'] && el['PREGUNTA'].trim() !== '') {
              uploadData.push({
                text: el['PREGUNTA'],
                group: sheet,
                options: [],
              });
            } else {
              if (el['INCISO']) {
                uploadData.at(-1)?.options.push({
                  text: el['OPCIONES'] ?? '',
                  isCorrect: el['RESPUESTA'] ? true : false,
                });
              }
            }
          });
        });
        this.questionService.upload(uploadData).subscribe();
      };
    }
  }
}

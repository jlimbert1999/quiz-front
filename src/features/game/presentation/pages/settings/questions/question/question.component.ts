import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmTrowComponent } from '@spartan-ng/ui-table-helm';
import { lucidePlus, lucideTrash } from '@ng-icons/lucide';

import {
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import {
  BrnDialogRef,
  injectBrnDialogContext,
} from '@spartan-ng/ui-dialog-brain';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';

import { FileService, QuestionService } from '../../../../services';
import { AutocompleteComponent } from '../../../../../../shared';
import { questionResponse } from '../../../../../infrastructure';
import {
  HlmTabsComponent,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
  HlmTabsContentDirective,
} from '@spartan-ng/ui-tabs-helm';

import { concat, Observable, switchMap, tap, toArray } from 'rxjs';

interface fileProps {
  file?: File;
  preview: string;
}
interface fileUploadProps {
  question: fileProps;
  options: fileProps[];
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmFormFieldModule,
    HlmInputDirective,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonModule,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmTrowComponent,
    HlmIconComponent,
    HlmLabelDirective,
    HlmCheckboxComponent,
    AutocompleteComponent,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
  ],
  templateUrl: './question.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [provideIcons({ lucidePlus, lucideTrash })],
})
export class QuestionComponent implements OnInit {
  @HostBinding('class') private readonly _class: string = 'flex flex-col gap-4';

  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private questionService = inject(QuestionService);

  private readonly _dialogRef =
    inject<BrnDialogRef<questionResponse>>(BrnDialogRef);
  private readonly dialogContext = injectBrnDialogContext<{
    question: questionResponse;
  }>();
  question? = this.dialogContext.question;

  questionForm: FormGroup = this.formBuilder.group({
    text: ['', Validators.required],
    group: ['', Validators.required],
    options: this.formBuilder.array([]),
    imageUrl: [],
  });

  groups = toSignal(this.questionService.getGroups(), { initialValue: [] });

  selectedFiles = signal<fileUploadProps>({
    question: { preview: '' },
    options: [],
  });

  ngOnInit(): void {
    this._loadForm();
  }

  save() {
    this._uploadImages()
      .pipe(
        switchMap(() =>
          this.question
            ? this.questionService.update(
                this.question._id,
                this.questionForm.value
              )
            : this.questionService.create(this.questionForm.value)
        )
      )
      .subscribe((data) => {
        this._dialogRef.close(data);
      });
  }

  onSelectQuestionImage(event: Event): void {
    const file = this._onInputFileSelect(event);
    if (!file) return;
    this.selectedFiles.update((values) => ({
      ...values,
      question: { file: file, preview: URL.createObjectURL(file) },
    }));
  }

  onSelectOptionImage(event: Event, index: number): void {
    const file = this._onInputFileSelect(event);
    if (!file) return;
    this.selectedFiles.update((values) => {
      values.options[index] = {
        file: file,
        preview: URL.createObjectURL(file),
      };
      return { ...values };
    });
  }

  onFilterGroup(value: string | null) {
    this.questionForm.get('group')?.setValue(value);
  }

  addOption() {
    this.options.push(
      this.formBuilder.group({
        text: [''],
        imageUrl: [],
        isCorrect: [false],
      })
    );
    this.selectedFiles.update((values) => {
      values.options.push({ preview: '' });
      return { ...values };
    });
  }

  removeOption(index: number) {
    this.options.removeAt(index);
    this.selectedFiles.update((values) => {
      values.options.splice(index, 1);
      return { ...values };
    });
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  private _loadForm(): void {
    if (!this.question) return;
    const { options, imageUrl, ...props } = this.question;
    options.forEach(() => this.addOption());
    this.questionForm.patchValue({
      ...props,
      imageUrl: imageUrl ? imageUrl.split('/').pop() : null,
      options: options.map((option) => ({
        ...option,
        imageUrl: option.imageUrl ? option.imageUrl.split('/').pop() : null,
      })),
    });

    this.selectedFiles.set({
      question: { preview: imageUrl ?? '' },
      options: options.map(({ imageUrl }) => ({ preview: imageUrl ?? '' })),
    });
  }

  private _onInputFileSelect(event: Event): File | null {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) return null;
    return inputElement.files[0];
  }

  private _uploadImages() {
    const subscriptions: Observable<{ file: string }>[] = [];
    const { question, options } = this.selectedFiles();
    if (question?.file) {
      subscriptions.push(this.fileService.uploadImage(question.file));
    }
    options.forEach((option) => {
      if (option.file) {
        subscriptions.push(this.fileService.uploadImage(option.file));
      }
    });
    return concat(...subscriptions).pipe(
      toArray(),
      tap((resp) => this._setImageUrl(resp.map(({ file }) => file)))
    );
  }

  private _setImageUrl(filenames: string[]) {
    if (filenames.length === 0) return;
    if (this.selectedFiles().question?.file) {
      this.questionForm.get('imageUrl')?.setValue(filenames.shift() ?? null);
    }
    this.selectedFiles().options.forEach((option, index) => {
      if (option.file) {
        const optionForm = this.options.at(index) as FormGroup;
        optionForm.get('imageUrl')?.setValue(filenames.shift() ?? null);
      }
    });
  }
}

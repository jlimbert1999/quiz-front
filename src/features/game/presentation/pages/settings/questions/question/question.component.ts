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
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective,
} from '@spartan-ng/ui-card-helm';

interface previewImages {
  question: string;
  options: Record<string, string>;
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

    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
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

  previewImages = signal<previewImages>({ question: '', options: {} });

  preview = signal<string[]>([]);

  ngOnInit(): void {
    this._loadForm();
  }

  save() {
    const subscription = this.question
      ? this.questionService.updateQeustion(
          this.question._id,
          this.questionForm.value
        )
      : this.questionService.createQuestion(this.questionForm.value);

    subscription.subscribe((data) => {
      this._dialogRef.close(data);
    });
  }

  onSelectQuestionImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
  

    // this.fileService.uploadImage(file).subscribe(({ file }) => {
    //   this.questionForm.get('imageUrl')?.setValue(file);
    //   // this.previewImages.update((values) => ({
    //   //   ...values,
    //   //   question: secureUrl,
    //   // }));
    // });
  }

  onSelectOptionImage(event: any, index: number): void {
    const file: File = event.target.files[0];
    if (!file) return;
    const firstGroup = this.options.at(index) as FormGroup;
    firstGroup.get('imageUrl')?.setValue(URL.createObjectURL(file))
    // this.fileService.uploadImage(file).subscribe(({ fileName, secureUrl }) => {
    //   const firstGroup = this.options.at(index) as FormGroup;
    //   firstGroup.patchValue({ imageUrl: fileName });
    //   this.previewImages.update((values) => {
    //     const { options } = values;
    //     options[fileName] = secureUrl;
    //     return { ...values, options };
    //   });
    // });
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
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  private _loadForm(): void {
    if (!this.question) return;
    const { options } = this.question;
    options.forEach(() => this.addOption());
    this.questionForm.patchValue(this.question);
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }
}

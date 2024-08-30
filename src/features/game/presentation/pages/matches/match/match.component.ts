import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { BrnDialogRef } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { MatchService } from '../../../services';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmFormFieldModule,
    HlmDialogTitleDirective,
    HlmInputDirective,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmButtonModule,
  ],
  templateUrl: './match.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchComponent {
  private formBuilder = inject(FormBuilder);
  private matchService = inject(MatchService);
  private readonly dialogRef = inject<BrnDialogRef>(BrnDialogRef);

  matchForm: FormGroup = this.formBuilder.group({
    player1name: ['', Validators.required],
    player2name: ['', Validators.required],
  });

  save(): void {
    this.matchService.create(this.matchForm.value).subscribe((match) => {
      this.dialogRef.close(match);
    });
  }
}

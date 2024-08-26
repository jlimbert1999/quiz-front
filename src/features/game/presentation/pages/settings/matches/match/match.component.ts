import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import {
  BrnDialogRef,
  injectBrnDialogContext,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { GameService } from '../../../../services';

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
  private gameService = inject(GameService);
  private readonly _dialogRef = inject<BrnDialogRef<any>>(BrnDialogRef);
  private readonly dialogContext = injectBrnDialogContext<{
    game: any;
  }>();
  game? = this.dialogContext.game;

  matchForm: FormGroup = this.formBuilder.group({
    player1: this.formBuilder.group({
      name: ['', Validators.required],
      score: [0, Validators.required],
    }),
    player2: this.formBuilder.group({
      name: ['', Validators.required],
      score: [0, Validators.required],
    }),
  });

  save() {
    const subscription = this.game
      ? this.gameService.update(this.game._id, this.matchForm.value)
      : this.gameService.create(this.matchForm.value);
    subscription.subscribe((data) => {
      this._dialogRef.close(data);
    });
  }
}

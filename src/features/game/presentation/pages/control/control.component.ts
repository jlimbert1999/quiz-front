import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

import { questionResponse } from '../../../infrastructure';
import { QuestionService } from '../../services';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,
  ],
  templateUrl: './control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  private questionService = inject(QuestionService);

  currentQuestion = signal<questionResponse | null>(null);
  currentGroup = signal<string>('');
  groups = toSignal(this.questionService.getGroups(), { initialValue: [] });
  isNextEnabled = computed(() => this.currentGroup() !== '');

  isOptionsDisplayed = signal<boolean>(false);

  readonly letters = ['a', 'b', 'c', 'd', 'e', 'f'];

  getRandomQuestion(): void {
    if (this.currentGroup() === '') return;
    this.isOptionsDisplayed.set(false);
    this.questionService.getRandom(this.currentGroup()).subscribe((resp) => {
      this.currentQuestion.set(resp);
    });
  }



  toggleOptions() {
    this.isOptionsDisplayed.set(true);
  }
}

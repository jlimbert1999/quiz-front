import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent { 
  
}

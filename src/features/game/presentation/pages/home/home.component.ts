import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { lucideSettings, lucidePlay } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HlmButtonDirective, HlmIconComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideSettings, lucidePlay })],
})
export class HomeComponent {}

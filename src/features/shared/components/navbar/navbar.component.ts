import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

interface menuOptions {
  label: string;
  route: string;
}
@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HlmButtonDirective, HlmIconComponent],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideMenu })],
})
export class NavbarComponent {
  items = input.required<menuOptions[]>();

  open = signal<boolean>(false);

  toggle(): void {
    this.open.update((value) => !value);
  }
}

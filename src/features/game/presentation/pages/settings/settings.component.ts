import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HlmTableComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    HlmCaptionComponent,
    NavbarComponent,
  ],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  showMenu = false;
  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }

  menu = [
    { label: 'Partidas', route: 'matches' },
    { label: 'Preguntas', route: 'questions' },
  ];
}

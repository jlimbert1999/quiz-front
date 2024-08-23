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
  protected _invoices = [
    {
      invoice: 'INV001',
      paymentStatus: 'Paid',
      totalAmount: '$250.00',
      paymentMethod: 'Credit Card',
    },
    {
      invoice: 'INV002',
      paymentStatus: 'Pending',
      totalAmount: '$150.00',
      paymentMethod: 'PayPal',
    },
    {
      invoice: 'INV003',
      paymentStatus: 'Unpaid',
      totalAmount: '$350.00',
      paymentMethod: 'Bank Transfer',
    },
    {
      invoice: 'INV004',
      paymentStatus: 'Paid',
      totalAmount: '$450.00',
      paymentMethod: 'Credit Card',
    },
    {
      invoice: 'INV005',
      paymentStatus: 'Paid',
      totalAmount: '$550.00',
      paymentMethod: 'PayPal',
    },
    {
      invoice: 'INV006',
      paymentStatus: 'Pending',
      totalAmount: '$200.00',
      paymentMethod: 'Bank Transfer',
    },
    {
      invoice: 'INV007',
      paymentStatus: 'Unpaid',
      totalAmount: '$300.00',
      paymentMethod: 'Credit Card',
    },
  ];
}

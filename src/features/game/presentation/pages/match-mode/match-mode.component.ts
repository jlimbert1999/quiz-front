import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-mode',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="flex flex-col md:flex-row gap-6">
        <div
          class="w-64 bg-white rounded-lg shadow-md hover:shadow-2xl"
          (click)="manage()"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-center text-gray-800">
              Administrar
            </h2>
          </div>
        </div>

        <div
          class="w-64 bg-white rounded-lg shadow-md hover:shadow-2xl"
          (click)="watch()"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-center text-gray-800">
              Espectar
            </h2>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchModeComponent {
  private router = inject(Router);

  manage() {
    this.router.navigateByUrl('/game/control');
  }

  watch() {
    this.router.navigateByUrl('/game/play');
  }
}

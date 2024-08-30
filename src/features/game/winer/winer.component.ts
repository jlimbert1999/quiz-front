import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatchService } from '../presentation/services';

@Component({
  selector: 'app-winer',
  standalone: true,
  imports: [CommonModule],
  template: `
   <div class="flex items-center justify-center h-screen relative overflow-hidden">
  <!-- Animación de Serpentinas -->
  <div class="absolute inset-0 confetti">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  <!-- Contenedor de la Pantalla de Victoria -->
  <div class="text-center p-8 bg-white rounded-lg shadow-lg animate-victory relative z-10">
    <h1 class="text-4xl font-bold text-green-500 mb-4">
      ¡Felicidades, {{ winner().name }}!
    </h1>
    <p class="text-2xl text-gray-700">
      Puntaje: {{ winner().score }}
    </p>
    <div class="mt-6">
     
    </div>
  </div>
</div>

  `,
  styleUrl: './winer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinerComponent implements OnInit {
  private matchservice = inject(MatchService);
  winner = signal({ name: '', score: 0 });

  ngOnInit(): void {
    if (!this.matchservice.currentMatch()) return;
    if (
      this.matchservice.currentMatch()?.player1.score! >
      this.matchservice.currentMatch()?.player2.score!
    ) {
      this.winner.set(this.matchservice.currentMatch()?.player1!);
    } else {
      this.winner.set(this.matchservice.currentMatch()?.player2!);
    }
  }
}

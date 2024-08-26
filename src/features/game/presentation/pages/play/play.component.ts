import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayComponent {
  pregunta = {
    texto: '¿Cuál es la capital de Francia?',
    imagen: 'assets/eiffel-tower.jpg',
    opciones: [
      { texto: 'Londres', valor: 'londres' },
      { texto: 'París', valor: 'paris', imagen: 'assets/paris.jpg' },
      { texto: 'Roma', valor: 'roma' },
    ],
  };
}

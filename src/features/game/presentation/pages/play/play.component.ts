import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { questionResponse } from '../../../infrastructure';
import { TransmisionService, MatchService } from '../../services';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:`


@keyframes fall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
}

@keyframes flash {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-fall {
  animation: fall 2s linear infinite;
}

.animate-flash {
  animation: flash 0.5s ease-out;
}

  `
})
export class PlayComponent implements OnInit {
  private transmisionService = inject(TransmisionService);
  private matchService = inject(MatchService);

  match = signal(this.matchService.currentMatch()!);

  question = signal<questionResponse | undefined>(
    this.matchService.currentMatch()?.currentQuestion
  );

  isOptionsDisplayed = signal<boolean>(false);
  selectedIndex = signal<number | null>(null);

  confetti = Array.from({ length: 100 }, () => ({
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * -100 + '%',
      transform: `rotate(${Math.random() * 360}deg)`,
      fontSize: Math.random() * 2 + 1 + 'rem',
    },
  }));

  constructor() {
    this._listenNextQuestion();
    this._listenDisplayOptions();
    this._listenAnswerQuestion();
  }

  text = signal<string>('Esperando');
  pregunta = {
    texto: '¿Cuál es la capital de Francia?',
    imagen: 'assets/eiffel-tower.jpg',
    opciones: [
      { texto: 'Londres', valor: 'londres' },
      { texto: 'París', valor: 'paris', imagen: 'assets/paris.jpg' },
      { texto: 'Roma', valor: 'roma' },
    ],
  };

  ngOnInit(): void {}

  private _listenNextQuestion() {
    this.transmisionService
      .listenNextQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((question) => {
        this.isOptionsDisplayed.set(false);
        this.selectedIndex.set(null);
        this.match.update((values) => ({
          ...values,
          currentQuestion: question,
        }));
      });
  }

  private _listenDisplayOptions() {
    this.transmisionService
      .listenDisplayOptions()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isOptionsDisplayed.set(true);
      });
  }

  private _listenAnswerQuestion() {
    this.transmisionService
      .listenAnswerQuestion()
      .pipe(takeUntilDestroyed())
      .subscribe((index) => {
        this.selectedIndex.set(index);
      });
  }

  opcionesNoGrandes(): boolean {
    // Aquí puedes definir tu lógica para decidir si las opciones son grandes o no
    // Esto puede depender de la longitud del texto, el tamaño de la imagen, etc.
    return this.pregunta.opciones.every((opcion) =>
      this.esOpcionPequena(opcion)
    );
  }

  esOpcionPequena(opcion: any): boolean {
    const textoCorto = opcion.texto && opcion.texto.length < 30;
    const sinImagen = !opcion.imagen;
    return textoCorto || sinImagen;
  }
}

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
})
export class PlayComponent implements OnInit {
  private transmisionService = inject(TransmisionService);
  private matchService = inject(MatchService);

  match = signal(this.matchService.currentMatch()!);

  question = signal<questionResponse | undefined>(
    this.matchService.currentMatch()?.currentQuestion
  );

  isOptionsDisplayed = signal<boolean>(false);

  constructor() {
    this._listenNextQuestion();
    this._listenDisplayOptions();
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

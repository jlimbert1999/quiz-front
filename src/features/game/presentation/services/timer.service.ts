import { Injectable, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private subscription: Subscription | null = null;
  private isStarted = false;
  label = signal<string>('00:00:00');

  start(init: number): void {
    if (this.isStarted) return;
    this.isStarted = true;
    this.subscription = timer(0, 1000).subscribe(() => {
      // this.label.set(FormatDate.duration(init, new Date().getTime()));
    });
  }
  static duration(startTime: number, endTime: number) {
    // const duration = moment.duration( endTime - startTime);
    // return moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
  }

  stop() {
    this.subscription?.unsubscribe();
    this.isStarted = false;
  }

  reset() {
    this.stop();
    this.label.set('00:00:00');
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmToasterComponent } from '@spartan-ng/ui-helm-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmToasterComponent, HlmButtonDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'quiz-front';
}

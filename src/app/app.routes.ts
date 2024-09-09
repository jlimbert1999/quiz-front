import { Routes } from '@angular/router';
import { StartComponent } from '../features/game/presentation/pages/start/start.component';
import { QuestionsComponent } from '../features/game/presentation/pages/settings/questions/questions.component';
import { ControlComponent } from '../features/game/presentation/pages/control/control.component';
import { PlayComponent } from '../features/game/presentation/pages/play/play.component';
import { matchGuard } from '../features/game/presentation/guards/match.guard';
import { MatchModeComponent } from '../features/game/presentation/pages/match-mode/match-mode.component';
import { isNotMatchConfigGuard } from '../features/game/presentation/guards/is-not-match-config.guard';
import { FinishComponent } from '../features/game/presentation/pages/finish/finish.component';

export const routes: Routes = [
  { path: 'questions', component: QuestionsComponent },
  {
    path: 'start',
    canActivate: [isNotMatchConfigGuard],
    component: StartComponent,
  },
  {
    path: 'finish/:id',
    component: FinishComponent,
  },
  {
    path: 'game',
    canActivate: [matchGuard],
    children: [
      { path: 'mode', component: MatchModeComponent },
      { path: 'play', component: PlayComponent },
      { path: 'control', component: ControlComponent },
    ],
  },
  { path: '', redirectTo: '/game/mode', pathMatch: 'full' },
  { path: '**', redirectTo: '/game/mode' },
];

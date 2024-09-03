import { Routes } from '@angular/router';
import { MatchesComponent } from '../features/game/presentation/pages/matches/matches.component';
import { HomeComponent } from '../features/game/presentation/pages/home/home.component';
import { SettingsComponent } from '../features/game/presentation/pages/settings/settings.component';
import { QuestionsComponent } from '../features/game/presentation/pages/settings/questions/questions.component';
import { ControlComponent } from '../features/game/presentation/pages/control/control.component';
import { PlayComponent } from '../features/game/presentation/pages/play/play.component';
import { gameGuard } from '../features/game/presentation/guards/game.guard';
import { WinerComponent } from '../features/game/winer/winer.component';

export const routes: Routes = [
  { path: 'main', component: HomeComponent },
  { path: 'questions', component: QuestionsComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: 'matches', component: MatchesComponent },

      { path: '', redirectTo: 'questions', pathMatch: 'full' },
    ],
  },
  { path: 'menu', component: MatchesComponent },
  {
    path: 'game',
    canActivate: [gameGuard],
    children: [
      { path: 'play', component: PlayComponent },
      { path: 'control', component: ControlComponent },
      { path: 'winner', component: WinerComponent },
    ],
  },
  { path: '**', component: MatchesComponent },
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
];

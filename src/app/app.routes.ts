import { Routes } from '@angular/router';
import { MainMenuComponent } from '../features/game/presentation/pages/main-menu/main-menu.component';
import { HomeComponent } from '../features/game/presentation/pages/home/home.component';
import { SettingsComponent } from '../features/game/presentation/pages/settings/settings.component';
import { MatchesComponent } from '../features/game/presentation/pages/settings/matches/matches.component';
import { QuestionsComponent } from '../features/game/presentation/pages/settings/questions/questions.component';
import { ControlComponent } from '../features/game/presentation/pages/control/control.component';
import { PlayComponent } from '../features/game/presentation/pages/play/play.component';
import { gameGuard } from '../features/game/presentation/guards/game.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      // { path: '', redirectTo: 'matches' },
      { path: 'matches', component: MatchesComponent },
      { path: 'questions', component: QuestionsComponent },
    ],
  },
  { path: 'menu', component: MainMenuComponent },
  {
    path: 'game',
    canActivate: [gameGuard],
    children: [
      { path: 'control', component: ControlComponent },
      { path: 'play', component: PlayComponent },
    ],
  },
];

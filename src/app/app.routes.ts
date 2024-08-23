import { Routes } from '@angular/router';
import { GameComponent } from '../features/game/presentation/pages/game/game.component';
import { HomeComponent } from '../features/game/presentation/pages/home/home.component';
import { SettingsComponent } from '../features/game/presentation/pages/settings/settings.component';
import { MatchesComponent } from '../features/game/presentation/pages/settings/matches/matches.component';
import { QuestionsComponent } from '../features/game/presentation/pages/settings/questions/questions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: 'matches', component: MatchesComponent },
      { path: 'questions', component: QuestionsComponent },
    ],
  },
];

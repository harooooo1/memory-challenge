import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationGuard } from './services/authentication.guard';
import { GameContainerComponent } from './components/game-container/game-container.component';
import { GamesListComponent } from './components/games-list/games-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'games', component: GamesListComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'games/:id', component: GameContainerComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

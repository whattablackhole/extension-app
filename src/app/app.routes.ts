import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { FinishedComponent } from './components/finished/finished.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'finished', component: FinishedComponent },
];

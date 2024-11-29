import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  // { path: '', component: HomeComponent,  canActivate: [authGuard] },
  { path: '', component: HomeComponent},

  { path: 'login', component: LoginComponent },
  {path: 'success', component: HomeComponent},
];

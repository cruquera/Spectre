import { Routes } from '@angular/router';
import { ProfileSelectComponent } from './profile-select.component';
import { LoginComponent } from './login.component';
import { CreateProfileComponent } from './create-profile.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: ProfileSelectComponent },
  { path: 'login/:slug', component: LoginComponent },
  { path: 'create', component: CreateProfileComponent },
];

import { Routes } from '@angular/router';

import { CreateProfileComponent } from './create-profile.component';
import { LoginComponent } from './login.component';
import { ProfileSelectComponent } from './profile-select.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: ProfileSelectComponent },
  { path: 'login/:slug', component: LoginComponent },
  { path: 'create', component: CreateProfileComponent },
];

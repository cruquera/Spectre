import { Routes } from '@angular/router';

import { CreateProfileComponent } from './create-profile.component';
import { LoginComponent } from './login.component';
import { ProfileSelectComponent } from './profile-select.component';

export const AUTH_ROUTES: Routes = [
  { component: ProfileSelectComponent, path: '' },
  { component: LoginComponent, path: 'login/:username' },
  { component: CreateProfileComponent, path: 'create' },
];

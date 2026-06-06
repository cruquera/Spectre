import { Routes } from '@angular/router';

import { CreateProfileComponent } from './create-profile.component';
import { ProfileSelectComponent } from './profile-select.component';

export const AUTH_ROUTES: Routes = [
  { component: ProfileSelectComponent, path: '' },
  { component: CreateProfileComponent, path: 'create' },
];

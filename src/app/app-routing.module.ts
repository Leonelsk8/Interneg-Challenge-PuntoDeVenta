import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, authGuardSession } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [authGuardSession],
    loadChildren: () =>
      import('./Login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'admin-panel',
    canActivate: [authGuard],
    loadChildren: () => import('./Home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/Login/login.page';
import { HomePage } from './pages/Home/home.page';


const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'admin-panel',
    component: HomePage
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
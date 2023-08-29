import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { FormLoginComponent } from './components/form/form-login.component';
import { LoginPage } from './pages/Login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LoginPage, FormLoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoginModule {}

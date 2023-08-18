import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { loginComponent } from './components/login/login.component';
import { LoginPage } from './pages/Login/login.page';
import { HomePage } from './pages/Home/home.page';
import { headerComponent } from './components/header/header.component';
import { panelComponent } from './components/panel/panel.component';
import { productsComponent } from './components/productsAbm/products.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { modalComponent } from './components/modal/modal.component';
import { modalSeeProductComponent } from './components/modalSeeProduct/modalSeeProduct.component';

@NgModule({
  declarations: [
    AppComponent,
    loginComponent,
    headerComponent,
    panelComponent,
    productsComponent,
    modalComponent,
    modalSeeProductComponent,
    LoginPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

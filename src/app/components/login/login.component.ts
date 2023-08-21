import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginApi } from '../../shared/services/login-api/loginApi.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class loginComponent{
  constructor(public login: loginApi){}
  openAlert:boolean = false;
  typeAlert:string = 'danger';
  messageAlert:string = '¡Error, usuario inexistente!';
  startLoader:boolean = false;

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  loginForm = new FormGroup({
    'username': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
  })

  onSubmit() {
    if (this.loginForm.valid) {
      this.startLoader = true;
      this.login.login(this.loginForm.value).pipe(
        catchError((error)=>{
          console.error('Error de servidor o de usuario:', error);
          this.startLoader = false;
          this.startAlert();
          return of(null);
        })
      ).subscribe((data)=>{
        this.startLoader = false;
        this.login.addTokenToStorage(data.ATO, data.user.name)
      })
    }
  }
}

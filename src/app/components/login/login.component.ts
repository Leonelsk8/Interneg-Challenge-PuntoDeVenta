import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from '../../shared/models/userModel/userModel';
import { loginApi } from '../../shared/services/login-api/loginApi.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class loginComponent{
  constructor(public login: loginApi){

  }

  loginForm = new FormGroup({
    'username': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
  })

  onSubmit() {
    if (this.loginForm.valid) {
      this.login.login(this.loginForm.value)
      .then((resp)=>resp.json())
      .then((data)=>{
        this.login.addTokenToStorage(data.ATO, data.user.name)
      })
      .catch((error)=>console.log(error))
    }
  }
}

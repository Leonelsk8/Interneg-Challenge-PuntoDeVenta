import { Component, OnInit } from '@angular/core';
import { getToken } from '../../shared/services/getToken/getToken.service';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})

export class LoginPage implements OnInit {
  constructor(private getTokenService: getToken){}
  
  ngOnInit(): void {
    this.getTokenService.redirectTo(2);
  }
}
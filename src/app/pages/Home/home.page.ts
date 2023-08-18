import { Component, OnInit } from '@angular/core';
import { getToken } from '../../shared/services/getToken/getToken.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})

export class HomePage implements OnInit{
  constructor(private getTokenService: getToken){}

  ngOnInit(): void {
    this.getTokenService.redirectTo(1);
  }
}

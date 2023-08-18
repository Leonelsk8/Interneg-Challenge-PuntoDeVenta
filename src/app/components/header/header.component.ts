import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getToken } from "../../shared/services/getToken/getToken.service";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class headerComponent implements OnInit{
  constructor(private route: Router, private getUserData: getToken){}

  userData:any;

  ngOnInit(): void {
    this.userData = this.getUserData.getData();
  }

  logout(){
    localStorage.removeItem("userData");
    this.route.navigate(['/login']);
  }
  
}
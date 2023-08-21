import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})


export class getToken{
  constructor(private router:Router){}
  
  getTokenStorage(){
    return localStorage.getItem("userData")
  }

  redirectTo(value:number){
    const userData = this.getTokenStorage();
    value===1 && !userData && this.router.navigate(['/login']);
    value===2 && userData && this.router.navigate(['/admin-panel']);
  }

  getData(){
    const userData = this.getTokenStorage();
    return JSON.parse(userData as never)
  }

}

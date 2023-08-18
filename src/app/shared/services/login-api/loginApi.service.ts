import { Injectable } from "@angular/core";
import { environment } from "src/app/enviroments/enviroment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class loginApi {
  constructor(private router: Router){

  }

  login(Payload:object){
     return fetch(`${environment.apiUrl}/login`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(Payload)
    })
  }

  addTokenToStorage(token:string, userName:string){
    const userData =JSON.stringify({
      ATO: token,
      name: userName
    })
    localStorage.setItem("userData", userData)
    this.router.navigate(['/admin-panel'])
  }
}
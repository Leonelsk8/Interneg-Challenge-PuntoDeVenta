import { Injectable } from "@angular/core";
import { environment } from "src/app/enviroments/enviroment";
import { Router } from "@angular/router";
import { HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class loginApi {
  constructor(private router: Router, private http: HttpClient){}

  login(Payload:object){
    return this.http.post<any>(`${environment.apiUrl}/login`,Payload)

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
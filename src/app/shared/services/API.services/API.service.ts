import { Injectable } from "@angular/core";
import { environment } from "../../../enviroments/enviroment";
import { getToken } from "../getToken/getToken.service";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class APIservice{
  constructor(private getToken: getToken, private http: HttpClient){}

  userData:any = {}
  httpOptions:any = {}
  
  getData(endpoint:string): Observable<any>{
    this.userData = this.getToken.getData();
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.userData.ATO
      })
    }
    return this.http.get<any>(`${environment.apiUrl}${endpoint}`, this.httpOptions)
  }

  createData(newData:object, endpoint:string): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}${endpoint}`,newData, this.httpOptions)
  }

  changePagination(resultPerPage:any, page:any, endpoint:String): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}${endpoint}?take=${resultPerPage}&page=${page}`, this.httpOptions)
  }

  searchData(value:any, endpoint:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}${endpoint}?search=${value}`, this.httpOptions)
  }

  getDataById(id:any, endpoint:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}${endpoint}/${id}`, this.httpOptions)
  }

  editData(editData:object,id:any, endpoint:string): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}${endpoint}/${id}`,editData, this.httpOptions)
  }

  deleteData(id:any, endpoint:string): Observable<any>{
    const payload={
      id:id
    }
    return this.http.post<any>(`${environment.apiUrl}${endpoint}/eliminar`,payload, this.httpOptions)
  }
}
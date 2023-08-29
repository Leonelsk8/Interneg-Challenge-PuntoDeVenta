import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIservice {
  constructor(private http: HttpClient) {}

  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${endpoint}`);
  }

  createData(newData: object, endpoint: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${endpoint}`, newData);
  }

  changePagination(
    resultPerPage: any,
    page: any,
    endpoint: String
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${endpoint}?take=${resultPerPage}&page=${page}`
    );
  }

  searchData(value: any, endpoint: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${endpoint}?search=${value}`
    );
  }

  getDataById(id: any, endpoint: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${endpoint}/${id}`);
  }

  editData(editData: object, id: any, endpoint: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/${endpoint}/${id}`,
      editData
    );
  }

  deleteData(id: any, endpoint: string): Observable<any> {
    const payload = {
      id: id,
    };
    return this.http.post<any>(
      `${environment.apiUrl}/${endpoint}/eliminar`,
      payload
    );
  }
}

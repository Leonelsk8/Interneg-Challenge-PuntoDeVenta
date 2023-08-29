import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private getToken: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const ATO = this.getToken.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': ATO ? ATO : '',
    });

    const reqClone = req.clone({
      headers,
    });

    return next.handle(reqClone);
  }
}

import { Injectable } from '@angular/core';
import { TokenModel } from '../../models/tokenStorage/token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  getAuthToken() {
    const getData: string | null = localStorage.getItem('userData');
    if (getData) {
      const token: TokenModel = JSON.parse(getData);
      return token.ATO;
    } else {
      return null;
    }
  }

  getNameUser() {
    const getData: string | null = localStorage.getItem('userData');
    if (getData) {
      const name: TokenModel = JSON.parse(getData);
      return name.name;
    } else {
      return '';
    }
  }
}

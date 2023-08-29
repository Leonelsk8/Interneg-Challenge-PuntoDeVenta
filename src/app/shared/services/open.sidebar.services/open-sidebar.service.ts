import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenSidebarService {
  private openSidebarSubject = new BehaviorSubject<boolean>(false);
  openSidebar$ = this.openSidebarSubject.asObservable();

  openSidebar() {
    this.openSidebarSubject.next(!this.openSidebarSubject.getValue());
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.services/auth.service';
import { OpenSidebarService } from 'src/app/shared/services/open.sidebar.services/open-sidebar.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class headerComponent implements OnInit {
  constructor(
    private route: Router,
    private getName: AuthService,
    private sidebarService: OpenSidebarService
  ) {}
  auxBoolean: boolean = false;
  userName!: string;

  ngOnInit(): void {
    const data = this.getName.getNameUser();
    if (data) {
      this.userName = data;
    }
  }

  logout() {
    localStorage.removeItem('userData');
    this.route.navigate(['/login']);
  }

  changePanel() {
    this.sidebarService.openSidebar();
  }
}

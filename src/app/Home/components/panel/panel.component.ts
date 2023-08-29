import { Component, OnInit, OnDestroy } from '@angular/core';
import { OpenSidebarService } from 'src/app/shared/services/open.sidebar.services/open-sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'panel-component',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class panelComponent implements OnInit, OnDestroy {
  constructor(private sidebarService: OpenSidebarService) {}
  sidebarOpen: boolean = false;
  sidebarSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.openSidebar$.subscribe(
      (open) => {
        this.sidebarOpen = open;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}

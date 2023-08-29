import { NgModule } from '@angular/core';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/Home/home.component';
import { headerComponent } from './components/header/header.component';
import { modalComponent } from './components/modal/modal.component';
import { modalSeeComponent } from './components/modalSee/modalSee.component';
import { saleComponent } from './components/newSale/sale.component';
import { panelComponent } from './components/panel/panel.component';
import { sidebarComponent } from './components/sidebar/sidebar.component';
import { tableAbmComponent } from './components/tableABM/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateSlicePipe } from 'src/app/shared/pipes/date-slice.pipe';

@NgModule({
  declarations: [
    headerComponent,
    panelComponent,
    sidebarComponent,
    tableAbmComponent,
    saleComponent,
    modalComponent,
    modalSeeComponent,
    HomePage,
    DateSlicePipe,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
  ],
})
export class HomeModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/Home/home.component';
import { tableAbmComponent } from './components/tableABM/table.component';
import { saleComponent } from './components/newSale/sale.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full',
      },
      {
        path: 'productos',
        component: tableAbmComponent,
      },
      {
        path: 'clientes',
        component: tableAbmComponent,
      },
      {
        path: 'ventas',
        component: tableAbmComponent,
      },
      {
        path: 'crear-venta',
        component: saleComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

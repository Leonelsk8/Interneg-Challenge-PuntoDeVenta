import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataProduct } from 'src/app/shared/models/productsModel/products.model';
import { DataClient } from 'src/app/shared/models/clientsModel/clients.model';
import { DataSale } from 'src/app/shared/models/saleModel/sale.model';

@Component({
  selector: 'modalSee-component',
  templateUrl: './modalSee.component.html',
  styleUrls: ['./modalSee.component.css'],
})
export class modalSeeComponent {
  constructor(public modal: NgbActiveModal) {}
  @Input() cliOrProdOrSale: string = '';
  @Input() elementData: DataSale & DataProduct & DataClient = {};
}

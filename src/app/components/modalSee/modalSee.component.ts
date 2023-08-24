import { Component, Input} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataProduct } from "../../shared/models/productsModel/products.model";
import { DataClient } from "../../shared/models/clientsModel/clients.model";
import { Sale } from "../../shared/models/saleModel/sale.model";

@Component({
  selector: 'modalSee-component',
  templateUrl: './modalSee.component.html',
  styleUrls: ['./modalSee.component.css']
})

export class modalSeeComponent{
  constructor(public modal: NgbActiveModal){}
  @Input() clientOrProduct:any;
  @Input() clientData:DataClient = {};
  @Input() productData:DataProduct={};
  @Input() saleData:Sale= {};
}
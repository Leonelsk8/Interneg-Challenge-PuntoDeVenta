import { Component, Input, OnInit } from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Data } from "../../shared/models/productsModel/products.model";

@Component({
  selector: 'modalSeeProduct-component',
  templateUrl: './modalSeeProduct.component.html',
  styleUrls: ['./modalSeeProduct.component.css']
})

export class modalSeeProductComponent implements OnInit{
  constructor(public modal: NgbActiveModal, private api: APIservice){}
  @Input() idProduct:any;
  endpoint:string = '/productos';
  productData:Data = {};

  ngOnInit(): void {
    this.api.getDataById(this.idProduct, this.endpoint).subscribe(data=>{
      this.productData = data.data;
    })
  }

}
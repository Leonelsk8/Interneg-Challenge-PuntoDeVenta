import { Component, OnInit} from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {modalComponent} from '../modal/modal.component';
import { modalSeeProductComponent } from "../modalSeeProduct/modalSeeProduct.component";
import { Products } from "../../shared/models/productsModel/products.model";
import Swal from 'sweetalert2';


@Component({
  selector: 'products-component',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class productsComponent implements OnInit {
  constructor(private modalService: NgbModal, private api:APIservice){}
  endpoint:string = '/productos'
  openAlert:boolean = false;
  typeAlert:string = '';
  messageAlert:string = '';

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  sweetAlertDelete(id:any){
    Swal.fire({
      title: '¿Quieres eliminar el producto?',
      text: "Esto no se podra revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteData(id, this.endpoint).subscribe(data=>{
          if(data.success){
            this.getAllProducts();
            this.typeAlert = 'success';
            this.messageAlert = '¡Producto eliminado con exito!';
            this.startAlert();
          }else{
            this.typeAlert = 'danger';
            this.messageAlert = '¡El producto no se pudo eliminar!';
            this.startAlert();
          }
        })
      }
    })
  }

  productData:Products = {}

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts(){
    this.api.getData(this.endpoint).subscribe(data=>{
      this.productData = data;
    })
  }

  modalOpen(value:any, dataProduct:any){
    const modalRef = this.modalService.open(modalComponent);
    modalRef.componentInstance.optionCreateEdit= value;
    modalRef.componentInstance.dataProduct= dataProduct;
    modalRef.componentInstance.productDataChanged.subscribe((updatedData:object) => {
      this.productData = updatedData; 
    });
  }

  nextPage(){
    this.api.changePagination(this.productData.pagination?.resultPerPage , this.productData.pagination?.nextPage, this.endpoint).subscribe(data=>{
      this.productData = data;
    })
  }

  prevPage(){
    this.api.changePagination(this.productData.pagination?.resultPerPage , this.productData.pagination?.prevPage, this.endpoint).subscribe(data=>{
      this.productData = data;
    })
  }

  changeItemPerPage(event:any){
    const resultPerPageSelect:number = parseInt(event.target.value);
    const resultPerPageActual:any = this.productData.pagination?.resultPerPage;
    const itemsInActualPage:any = this.productData.data?.length;
    let redirectPageActualOrPrev = this.productData.pagination?.actualPage;

    if(resultPerPageSelect > resultPerPageActual){
      if(itemsInActualPage + resultPerPageActual === resultPerPageSelect){
        redirectPageActualOrPrev = this.productData.pagination?.prevPage;
      }  
    } 

    if(resultPerPageSelect >= 1 && resultPerPageSelect<=10){
      this.api.changePagination(resultPerPageSelect , redirectPageActualOrPrev, this.endpoint).subscribe(data=>{
        this.productData = data;
      })
    }
  }

  valueInputSearch:string = ''

  searchProduct(){
    this.api.searchData(this.valueInputSearch, this.endpoint).subscribe(data=>{
      this.productData = data;
      console.log(data)
    })
  }

  seeProduct(value:any){
    const modalRef = this.modalService.open(modalSeeProductComponent);
    modalRef.componentInstance.idProduct= value;
  }

  deleteProduct(id:any){
    this.sweetAlertDelete(id);
  } 

}
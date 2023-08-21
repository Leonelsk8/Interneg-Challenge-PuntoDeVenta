import { Component, OnInit, Input} from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {modalComponent} from '../modal/modal.component';
import { modalSeeComponent } from "../modalSee/modalSee.component";
import { Products } from "../../shared/models/productsModel/products.model";
import { Clients } from "../../shared/models/clientsModel/clients.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'table-abm-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class tableAbmComponent implements OnInit{
  constructor(private modalService: NgbModal, private api:APIservice){}
  @Input() optionClientOrProduct:number = 1
  endpoint:string = '';
  startLoader:boolean = true;
  reloadNewSearchButtons:boolean = false;

  valueInputSearch:string = '';
  clientsData:Clients = {};
  productsData:Products = {};

  openAlert:boolean = false;
  typeAlert:string = '';
  messageAlert:string = '';

  buttonNext:any = null;
  buttonPrev:any = null;

  ngOnInit(): void {
    this.endpoint = this.optionClientOrProduct===1 ? '/productos' : '/clientes';
    this.getAllData();
  }

  buttonDisabledChange(next:any,prev:any){
    this.buttonNext = next;
    this.buttonPrev = prev;
  }

  getAllData(){
    this.api.getData(this.endpoint).subscribe(data=>{
      this.optionClientOrProduct===1 ?  
      this.productsData = data : 
      this.clientsData = data;
      this.startLoader=false;
      this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
    })
  }

  modalOpen(value:any, dataElement:any){
    const modalRef = this.modalService.open(modalComponent);
    modalRef.componentInstance.optionCreateEdit= value;
    modalRef.componentInstance.dataElement= dataElement;
    modalRef.componentInstance.clientOrProduct = this.optionClientOrProduct===1 ? 'Producto' : 'Cliente';
    modalRef.componentInstance.DataChanged.subscribe((updatedData:any) => {
      this.optionClientOrProduct===1 ? 
      this.productsData = updatedData :
      this.clientsData = updatedData;
      this.buttonDisabledChange(updatedData.pagination.nextPage, updatedData.pagination.prevPage);
    });
  }

  seeData(idElement:any){
    this.api.getDataById(idElement, this.endpoint).subscribe(data=>{
      const modalRef = this.modalService.open(modalSeeComponent);
      if(this.optionClientOrProduct===1){
        modalRef.componentInstance.productData= data.data;
        modalRef.componentInstance.clientOrProduct= 'Producto';
      }else{
        modalRef.componentInstance.clientData= data.data;
        modalRef.componentInstance.clientOrProduct= 'Cliente';
      }
    })
  }

  searchData(){
    this.api.searchData(this.valueInputSearch, this.endpoint).subscribe(data=>{
      this.optionClientOrProduct===1 ? 
      this.productsData = data :
      this.clientsData = data;
      this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      this.reloadNewSearchButtons = true;
    })
  }
 
  nextPage(){
    if(this.optionClientOrProduct === 1){
      this.api.changePagination(this.productsData.pagination?.resultPerPage , this.productsData.pagination?.nextPage, this.endpoint).subscribe(data=>{
        this.productsData = data;
        this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      })
    }else{
      this.api.changePagination(this.clientsData.pagination?.resultPerPage , this.clientsData.pagination?.nextPage, this.endpoint).subscribe(data=>{
        this.clientsData = data;
        this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      })
    }
  }

  prevPage(){
    if(this.optionClientOrProduct === 1){
      this.api.changePagination(this.productsData.pagination?.resultPerPage , this.productsData.pagination?.prevPage, this.endpoint).subscribe(data=>{
        this.productsData = data;
        this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      })
    }else{
      this.api.changePagination(this.clientsData.pagination?.resultPerPage , this.clientsData.pagination?.prevPage, this.endpoint).subscribe(data=>{
        this.clientsData = data;
        this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      })
    }
  }

  
  deleteData(id:any){
    this.sweetAlertDelete(id, this.optionClientOrProduct === 1 ? 'Producto' : 'Cliente');
  }


  sweetAlertDelete(id:any, element:any){
    Swal.fire({
      title: `¿Quieres eliminar el ${element}?`,
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
            this.getAllData();
            this.typeAlert = 'success';
            this.messageAlert = `¡${element} eliminado con exito!`;
            this.startAlert();
          }else{
            this.typeAlert = 'danger';
            this.messageAlert = `¡El ${element} no se pudo eliminar!`;
            this.startAlert();
          }
        })
      }
    })
  }

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  changeItemPerPage(event:any){
    const resultPerPageSelect:number = parseInt(event.target.value);
    if(resultPerPageSelect >= 1 && resultPerPageSelect<=10){
      this.api.changePagination(resultPerPageSelect , 1, this.endpoint).subscribe(data=>{
        this.optionClientOrProduct === 1 ?
        this.productsData = data :
        this.clientsData = data;
        this.buttonDisabledChange(data.pagination.nextPage, data.pagination.prevPage);
      })
    }
  }

  reloadOrSearchData(reload:boolean){
    this.reloadNewSearchButtons = false;
    this.valueInputSearch = '';
    reload && this.getAllData();
  }

}
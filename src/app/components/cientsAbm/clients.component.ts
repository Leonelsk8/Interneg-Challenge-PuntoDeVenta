import { Component, OnInit } from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { Clients } from "../../shared/models/clientsModel/clients.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { modalComponent } from '../modal/modal.component';
import { modalSeeComponent } from "../modalSee/modalSee.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'clients-component',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class clientsComponents implements OnInit{
  constructor(private api:APIservice, private modalService: NgbModal){}

  endpoint:string = '/clientes';
  clientData:Clients = {};

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
      title: '¿Quieres eliminar el cliente?',
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
            this.getAllClients();
            this.typeAlert = 'success';
            this.messageAlert = '¡Cliente eliminado con exito!';
            this.startAlert();
          }else{
            this.typeAlert = 'danger';
            this.messageAlert = '¡El Cliente no se pudo eliminar!';
            this.startAlert();
          }
        })
      }
    })
  }

  getAllClients(){
    this.api.getData(this.endpoint).subscribe(data=>{
      this.clientData = data;
    })
  }

  ngOnInit(): void {
    this.getAllClients();
  }

  modalOpen(value:any, dataClient:any){
    const modalRef = this.modalService.open(modalComponent);
    modalRef.componentInstance.optionCreateEdit= value;
    modalRef.componentInstance.dataElement= dataClient;
    modalRef.componentInstance.clientOrProduct = 'Cliente';
    modalRef.componentInstance.productDataChanged.subscribe((updatedData:object) => {
      this.clientData = updatedData; 
    });
  }

  valueInputSearch:string = ''

  searchClient(){
    this.api.searchData(this.valueInputSearch, this.endpoint).subscribe(data=>{
      this.clientData = data;
      console.log(data)
    })
  }

  nextPage(){
    this.api.changePagination(this.clientData.pagination?.resultPerPage , this.clientData.pagination?.nextPage, this.endpoint).subscribe(data=>{
      this.clientData = data;
    })
  }

  prevPage(){
    this.api.changePagination(this.clientData.pagination?.resultPerPage , this.clientData.pagination?.prevPage, this.endpoint).subscribe(data=>{
      this.clientData = data;
    })
  }

  changeItemPerPage(event:any){
    const resultPerPageSelect:number = parseInt(event.target.value);
    const resultPerPageActual:any = this.clientData.pagination?.resultPerPage;
    const itemsInActualPage:any = this.clientData.data?.length;
    let redirectPageActualOrPrev = this.clientData.pagination?.actualPage;

    if(resultPerPageSelect > resultPerPageActual){
      if(itemsInActualPage + resultPerPageActual === resultPerPageSelect){
        redirectPageActualOrPrev = this.clientData.pagination?.prevPage;
      }  
    } 

    if(resultPerPageSelect >= 1 && resultPerPageSelect<=10){
      this.api.changePagination(resultPerPageSelect , redirectPageActualOrPrev, this.endpoint).subscribe(data=>{
        this.clientData = data;
      })
    }
  }

  seeClient(value:any){
    this.api.getDataById(value, this.endpoint).subscribe(data=>{
      const modalRef = this.modalService.open(modalSeeComponent);
      modalRef.componentInstance.clientData= data.data;
      modalRef.componentInstance.clientOrProduct= 'Cliente';
    })
  }

  deleteClient(id:any){
    this.sweetAlertDelete(id);
  }

}
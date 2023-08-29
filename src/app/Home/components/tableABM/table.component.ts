import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIservice } from 'src/app/shared/services/API.services/API.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { modalComponent } from '../modal/modal.component';
import { modalSeeComponent } from '../modalSee/modalSee.component';
import Swal from 'sweetalert2';
import { ElementModel } from 'src/app/shared/models/elementsModel/element.model';
import { DataProduct } from 'src/app/shared/models/productsModel/products.model';
import { DataClient } from 'src/app/shared/models/clientsModel/clients.model';
import { DataSale } from 'src/app/shared/models/saleModel/sale.model';
import { Observable, tap, catchError, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'table-abm-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class tableAbmComponent implements OnInit , OnDestroy {
  constructor(
    private modalService: NgbModal,
    private api: APIservice,
    private route: ActivatedRoute
  ) {}
  private destroy$ = new Subject<void>();
  elementData$!: Observable<ElementModel<DataSale & DataProduct & DataClient>>;
  endpoint: string = '';
  
  valueInputSearch: string = '';
  resultPerPageSelect: number = 5;
  
  reloadNewSearchButtons: boolean = false;
  hasError: boolean = false;
  openAlert: boolean = false;
  typeAlert: string = '';
  messageAlert: string = '';

  buttonNext: null | number = null;
  buttonPrev: null | number = null;
  resultPerPage: null | number = null;

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.endpoint = segments[segments.length - 1].path;
      this.getAllData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buttonDisabledChange(next: any, prev: any, results: any) {
    this.buttonNext = next;
    this.buttonPrev = prev;
    this.resultPerPage = results;
  }

  getAllData=() =>{
    this.elementData$ = this.api.getData(this.endpoint).pipe(
      tap(data=>{
        this.buttonDisabledChange(
          data?.pagination?.nextPage,
          data?.pagination?.prevPage,
          data?.pagination?.resultPerPage
        );
      }),
      catchError((error) => {
        console.error(error);
        this.hasError = true;
        throw new Error(error);
      })
    )
  }

  modalOpen(value: any, dataElement: any) {
    const modalRef = this.modalService.open(modalComponent);
    modalRef.componentInstance.optionCreateEdit = value;
    modalRef.componentInstance.dataElement = dataElement;
    modalRef.componentInstance.endpoint = this.endpoint;
    modalRef.componentInstance.getAllData = ()=>this.getAllData();
  }

  seeData(idElement: any) {
    this.api.getDataById(idElement, this.endpoint).pipe(
      catchError((error) => {
        console.error(error);
        throw new Error(error);
      }),
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      const modalRef = this.modalService.open(modalSeeComponent, {
        centered: this.endpoint === 'ventas' && true,
        size: this.endpoint === 'ventas' ? 'lg' : 'md',
      });
      modalRef.componentInstance.elementData = data.data;
      modalRef.componentInstance.cliOrProdOrSale = this.endpoint;
    });
  }

  searchData() {
    this.reloadNewSearchButtons = true;
    if (this.endpoint !== 'ventas') {
      this.elementData$ = this.api
        .searchData(this.valueInputSearch, this.endpoint)
        .pipe(
          tap((data) => {
            this.buttonDisabledChange(
              data?.pagination?.nextPage,
              data?.pagination?.prevPage,
              data?.pagination?.resultPerPage
            );
          }),
          catchError((error) => {
            console.error(error);
            this.hasError = true;
            throw new Error(error);
          })
        );
    }
  }

  changePage(value:number|string) {
    let prevOrNext;
    if(typeof value === 'string'){
      prevOrNext = value === 'next' ? this.buttonNext : this.buttonPrev;
    }else{
      prevOrNext = value;
    }
    this.elementData$ = this.api
      .changePagination(this.resultPerPage, prevOrNext, this.endpoint)
      .pipe(
        tap((data) => {
          this.buttonDisabledChange(
            data?.pagination?.nextPage,
            data?.pagination?.prevPage,
            data?.pagination?.resultPerPage
          );
        }),
        catchError((error) => {
          console.error(error);
          this.hasError = true;
          throw new Error(error);
        })
      );
  }

  deleteData(id: any) {
    switch (this.endpoint) {
      case 'productos':
        this.sweetAlertDelete(id, 'El Producto');
        break;
      case 'clientes':
        this.sweetAlertDelete(id, 'El Cliente');
        break;
      case 'ventas':
        this.sweetAlertDelete(id, 'La venta');
        break;
      default:
        break;
    }
  }

  sweetAlertDelete(id: any, element: string) {
    Swal.fire({
      title: `¿Quieres eliminar ${element}?`,
      text: 'Esto no se podra revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteData(id, this.endpoint).pipe(
          catchError((error) => {
            console.error(error);
            this.typeAlert = 'danger';
            this.messageAlert = `¡Ocurrió un error de servidor al eliminar!`;
            this.startAlert();
            throw new Error(error);
          }),
          takeUntil(this.destroy$)
        ).subscribe((data) => {
          if (data.success) {
            this.getAllData();
            this.typeAlert = 'success';
            this.messageAlert = `¡${element} se eliminó con exito!`;
            this.startAlert();
          } else {
            this.typeAlert = 'warning';
            this.messageAlert = `¡${element} no se pudo eliminar!`;
            this.startAlert();
          }
        });
      }
    });
  }

  startAlert() {
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  changeItemPerPage() {
    if (this.resultPerPageSelect >= 1 && this.resultPerPageSelect <= 10) {
      this.elementData$ = this.api
        .changePagination(this.resultPerPageSelect, 1, this.endpoint)
        .pipe(
          tap((data) => {
            this.buttonDisabledChange(
              data?.pagination?.nextPage,
              data?.pagination?.prevPage,
              data?.pagination?.resultPerPage
            );
          }),
          catchError((error) => {
            console.error(error);
            this.hasError = true;
            throw new Error(error);
          })
        );
    }
  }

  reloadOrSearchData(reload: boolean) {
    this.reloadNewSearchButtons = false;
    this.valueInputSearch = '';
    reload && this.getAllData();
  }
}

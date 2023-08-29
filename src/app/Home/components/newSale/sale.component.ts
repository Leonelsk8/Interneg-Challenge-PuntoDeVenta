import { Component, OnInit, OnDestroy } from '@angular/core';
import { APIservice } from 'src/app/shared/services/API.services/API.service';
import { DataProduct } from 'src/app/shared/models/productsModel/products.model';
import { DataClient } from 'src/app/shared/models/clientsModel/clients.model';
import { ElementModel } from 'src/app/shared/models/elementsModel/element.model';
import { ProductsSelect } from 'src/app/shared/models/saleModel/sale.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataSale } from 'src/app/shared/models/saleModel/sale.model';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  takeUntil,
  Subject,
  catchError,
  of,
} from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sale-component',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class saleComponent implements OnInit, OnDestroy {
  constructor(private api: APIservice) {}
  private destroy$ = new Subject<void>();

  import_total: string = '0.00';
  selectedDate: NgbDateStruct | null = null;
  activatedLiveSearchClient: boolean = false;
  activatedLiveSearchProduct: boolean = false;

  inputValueSearchProduct = new FormControl();
  inputValueSearchClient = new FormControl();
  productsLiveSearch$!: Observable<ElementModel<DataProduct>>;
  clientsLiveSearch$!: Observable<ElementModel<DataClient>>;

  productsSelected: ProductsSelect[] = [];
  id_client: number = 0;
  name_client: string = '';

  openAlert: boolean = false;
  typeAlert: string = '';
  messageAlert: string = '';

  startAlert() {
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  ngOnInit(): void {
    this.inputValueSearchProduct.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.searchProducts(value);
      });
    this.inputValueSearchClient.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.searchClients(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchProducts(value: string) {
    if (value !== '') {
      this.productsLiveSearch$ = this.api.searchData(value, 'productos').pipe(
        catchError((error) => {
        console.error(error);
        throw new Error(error);
      })
      );
      this.activatedLiveSearchProduct = true;
    } else {
      this.activatedLiveSearchProduct = false;
    }
  }

  searchClients(value: string) {
    if (value !== '') {
      this.clientsLiveSearch$ = this.api.searchData(value, 'clientes').pipe(
        catchError((error) => {
        console.error(error);
        throw new Error(error);
        })
      );
      this.activatedLiveSearchClient = true;
    } else {
      this.activatedLiveSearchClient = false;
    }
  }

  selectProduct(id: any, precio: any, nombre: any) {
    const itemId: number = this.productsSelected.findIndex(
      (item) => item.producto_id === id
    );
    if (itemId === -1) {
      this.productsSelected.push({
        producto_id: id,
        nombre: nombre,
        precio_unitario: precio,
        cantidad: 1,
        importe_total: precio,
      });
      this.importTotal();
    } else {
      this.itemChangedImport(itemId, 'suma');
    }
    this.activatedLiveSearchProduct = false;
  }

  selectClient(id: any, name: any) {
    this.activatedLiveSearchClient = false;
    this.id_client = id;
    this.name_client = name;
  }

  itemChangedImport(index: any, operation: any) {
    const item = this.productsSelected[index];
    if (item.cantidad && item.precio_unitario) {
      const newCant =
        operation === 'suma' ? item.cantidad + 1 : item.cantidad - 1;
      const price_unit = parseFloat(item.precio_unitario);
      const price_total = price_unit * newCant;
      const price_totalFormated = price_total.toFixed(2);
      this.productsSelected[index].cantidad = newCant;
      this.productsSelected[index].importe_total = price_totalFormated;
      this.importTotal();
    }
  }

  incrementDecrement(value: string, index: number) {
    if (value === 'suma') {
      this.itemChangedImport(index, value);
    } else if (value === 'resta') {
      if (this.productsSelected[index].cantidad === 1) {
        this.productsSelected.splice(index, 1);
        this.importTotal();
      } else {
        this.itemChangedImport(index, 'resta');
      }
    }
  }

  importTotal() {
    let total: number = 0;
    this.productsSelected.map((item) => {
      if (item.importe_total) {
        total = total + parseFloat(item.importe_total);
      }
    });
    this.import_total = total.toFixed(2);
  }

  removeClient() {
    this.id_client = 0;
    this.name_client = '';
  }

  onDateSelection(date: NgbDateStruct) {
    this.selectedDate = date;
  }

  createSale() {
    const payload: DataSale = {
      cliente_id: this.id_client,
      fecha: `${this.selectedDate?.year}/${this.selectedDate?.month}/${this.selectedDate?.day}`,
      importe_total: parseFloat(this.import_total),
      items: this.productsSelected,
    };
    this.api
      .createData(payload, '/ventas')
      .pipe(
        catchError((error) => {
          this.typeAlert = 'danger';
          this.messageAlert =
            '¡Ocurrió un error de servidor al crear la venta!';
          this.startAlert();
          return of(error);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data.success) {
          this.typeAlert = 'success';
          this.messageAlert = '¡La venta se realizó con exito!';
        } else {
          this.typeAlert = 'warning';
          this.messageAlert = '¡La venta no se realizó correctamente!';
        }
        this.startAlert();
      });
  }
}

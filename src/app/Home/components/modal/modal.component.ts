import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { APIservice } from 'src/app/shared/services/API.services/API.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataClient } from 'src/app/shared/models/clientsModel/clients.model';
import { DataProduct } from 'src/app/shared/models/productsModel/products.model';
import { catchError, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class modalComponent implements OnInit {
  constructor(public modal: NgbActiveModal, private api: APIservice) {}
  private destroy$ = new Subject<void>();

  @Input() optionCreateEdit: number = 1;

  @Input() dataElement: DataClient & DataProduct = {};

  @Input() endpoint: string = '';

  @Input() getAllData: any;

  openAlert: boolean = false;
  typeAlert: string = '';
  messageAlert: string = '';

  ngOnInit(): void {
    if (this.endpoint === 'productos' && this.optionCreateEdit === 2) {
      this.dataElement.nombre &&
        this.productForm.controls.nombre.setValue(this.dataElement.nombre);
      this.dataElement.codigo &&
        this.productForm.controls.codigo.setValue(this.dataElement.codigo);
      this.dataElement.precio &&
        this.productForm.controls.precio.setValue(this.dataElement.precio);
    } else if (this.endpoint === 'clientes' && this.optionCreateEdit === 2) {
      this.dataElement.nombre &&
        this.clientForm.controls.nombre.setValue(this.dataElement.nombre);
      this.dataElement.cuit &&
        this.clientForm.controls.cuit.setValue(this.dataElement.cuit);
      this.dataElement.email &&
        this.clientForm.controls.email.setValue(this.dataElement.email);
      this.dataElement.domicilio &&
        this.clientForm.controls.domicilio.setValue(this.dataElement.domicilio);
      this.dataElement.telefono &&
        this.clientForm.controls.telefono.setValue(this.dataElement.telefono);
    }
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  };

  productForm = new FormGroup({
    nombre: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    codigo: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    precio: new FormControl<number>(0.01, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
  });

  clientForm = new FormGroup({
    nombre: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    cuit: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(30),
    ]),
    domicilio: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    telefono: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
  });

  onInput(event: any) {
    const inputValue = parseFloat(event.target.value);
    if (!isNaN(inputValue)) {
      const formattedValue = parseFloat(inputValue.toFixed(2));
      this.productForm.get('precio')?.setValue(formattedValue);
    }
  }

  startAlert() {
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  create() {
    const messageCase = this.endpoint === 'productos' ? 'Producto' : 'Cliente';
    this.api
      .createData(
        this.endpoint === 'productos'
          ? this.productForm.value
          : this.clientForm.value,
        this.endpoint
      )
      .pipe(
        catchError((error) => {
          this.typeAlert = 'danger';
          this.messageAlert = `¡Ocurrió un error de servidor al crear el ${messageCase}!`;
          this.startAlert();
          return of(error);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data.success) {
          this.getAllData();
          this.typeAlert = 'success';
          this.messageAlert = `¡${messageCase} creado con exito!`;
          this.startAlert();
        } else {
          this.typeAlert = 'warning';
          this.messageAlert = `¡El ${messageCase} no se pudo crear!`;
          this.startAlert();
        }
      });
  }

  edit() {
    let payload: object;
    if (this.endpoint === 'productos') {
      payload = {
        nombre: this.productForm.value.nombre,
        codigo: this.productForm.value.codigo,
        precio: this.productForm.value.precio,
        id: this.dataElement.id,
      };
    } else {
      payload = {
        nombre: this.clientForm.value.nombre,
        cuit: this.clientForm.value.cuit,
        email: this.clientForm.value.email,
        domicilio: this.clientForm.value.domicilio,
        telefono: this.clientForm.value.telefono,
        id: this.dataElement.id,
      };
    }
    const messageCase = this.endpoint === 'productos' ? 'Producto' : 'Cliente';
    this.api
      .editData(payload, this.dataElement.id, this.endpoint)
      .pipe(
        catchError((error) => {
          this.typeAlert = 'danger';
          this.messageAlert = `¡Ocurrió un error de servidor al editar el ${messageCase}!`;
          this.startAlert();
          return of(error);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data.success) {
          this.getAllData();
          this.typeAlert = 'success';
          this.messageAlert = `¡${messageCase} editado con exito!`;
          this.startAlert();
        } else {
          this.typeAlert = 'warning';
          this.messageAlert = `¡El ${messageCase} no se pudo editar!`;
          this.startAlert();
        }
      });
  }

  onSubmit() {
    if (this.productForm.valid || this.clientForm.valid) {
      this.optionCreateEdit === 1 ? this.create() : this.edit();
    }
  }
}

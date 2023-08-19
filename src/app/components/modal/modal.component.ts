import { Component, Output, EventEmitter, Input } from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class modalComponent{
  constructor(public modal: NgbActiveModal, private api:APIservice){}

  @Input() optionCreateEdit:any 

  @Input() dataElement:any

  @Input() clientOrProduct:any

  @Output() productDataChanged = new EventEmitter<object>();

  openAlert:boolean = false;
  typeAlert:string = '';
  messageAlert:string = '';

  
  productForm = new FormGroup({
    'nombre': new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    'codigo': new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    'precio': new FormControl<number>(0.01, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
  })

  clientForm = new FormGroup({
    'nombre': new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    'cuit': new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    'email': new FormControl<string>('', [Validators.required, Validators.email, Validators.maxLength(30)]),
    'domicilio': new FormControl<string>('', [Validators.required, Validators.maxLength(30)]),
    'telefono': new FormControl<string>('', [Validators.required, Validators.maxLength(30)])
  })

  onInput(event: any) {
    const inputValue = parseFloat(event.target.value);
    if (!isNaN(inputValue)) {
      const formattedValue = parseFloat(inputValue.toFixed(2));
      this.productForm.get('precio')?.setValue(formattedValue);
    }
  }

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  sendDataToPanel(){
    this.api.getData(this.clientOrProduct==='Producto'?'/productos':'/clientes').subscribe(data=>{
      this.productDataChanged.emit(data);
    })
  }

  create(){
    this.api.createData(this.clientOrProduct==='Producto'? this.productForm.value : this.clientForm.value, this.clientOrProduct==='Producto'?'/productos':'/clientes').subscribe(data=>{
      if(data.success){
        this.sendDataToPanel();
        this.typeAlert = 'success';
        this.messageAlert = `¡${this.clientOrProduct} creado con exito!`;
        this.startAlert();
      }else{
        this.typeAlert = 'danger';
        this.messageAlert = `¡El ${this.clientOrProduct} no se pudo crear!`;
        this.startAlert();
      }
    })
  }

  edit(){
    let payload:object;
    if(this.clientOrProduct === 'Producto'){
      payload = {
        nombre: this.productForm.value.nombre,
        codigo: this.productForm.value.codigo,
        precio: this.productForm.value.precio,
        id: this.dataElement.id
      }
    }else{
      payload = {
        nombre: this.clientForm.value.nombre,
        cuit: this.clientForm.value.cuit,
        email: this.clientForm.value.email,
        domicilio: this.clientForm.value.domicilio,
        telefono: this.clientForm.value.telefono,
        id: this.dataElement.id
      }
    }
    this.api.editData(payload, this.dataElement.id, this.clientOrProduct==='Producto'?'/productos':'/clientes').subscribe(data=>{
      if(data.success){
        this.sendDataToPanel();
        this.typeAlert = 'success';
        this.messageAlert = `¡${this.clientOrProduct} editado con exito!`;
        this.startAlert();
      }else{
        this.typeAlert = 'danger';
        this.messageAlert = `¡El ${this.clientOrProduct} no se pudo editar!`;
        this.startAlert();
      }
    })
  }

  onSubmit() {
    if(this.clientOrProduct === 'Producto'){
      if (this.productForm.valid) {
        this.optionCreateEdit === 1 ? this.create() : this.edit()
      }
    }else{
      if (this.clientForm.valid) {
        this.optionCreateEdit === 1 ? this.create() : this.edit()
      }
    }
  }
}
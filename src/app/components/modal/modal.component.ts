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

  @Input() dataProduct:any

  @Output() productDataChanged = new EventEmitter<object>();
  endpoint:string = '/productos'
  openAlert:boolean = false;
  typeAlert:string = '';
  messageAlert:string = '';

  
  createForm = new FormGroup({
    'nombre': new FormControl<string>('', Validators.required),
    'codigo': new FormControl<string>('', Validators.required),
    'precio': new FormControl<number>(0.01, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
  })

  onInput(event: any) {
    const inputValue = parseFloat(event.target.value);
    if (!isNaN(inputValue)) {
      const formattedValue = parseFloat(inputValue.toFixed(2));
      this.createForm.get('precio')?.setValue(formattedValue);
    }
  }

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  sendDataToPanel(){
    this.api.getData(this.endpoint).subscribe(data=>{
      this.productDataChanged.emit(data);
    })
  }

  create(){
    this.api.createData(this.createForm.value, this.endpoint).subscribe(data=>{
      if(data.success){
        this.sendDataToPanel();
        this.typeAlert = 'success';
        this.messageAlert = '¡Producto creado con exito!';
        this.startAlert();
      }else{
        this.typeAlert = 'danger';
        this.messageAlert = '¡El producto no se pudo crear!';
        this.startAlert();
      }
    })
  }

  edit(){
    const payload = {
      nombre: this.createForm.value.nombre,
      codigo: this.createForm.value.codigo,
      precio: this.createForm.value.precio,
      id: this.dataProduct.id
    }
    this.api.editData(payload, this.dataProduct.id, this.endpoint).subscribe(data=>{
      if(data.success){
        this.sendDataToPanel();
        this.typeAlert = 'success';
        this.messageAlert = '¡Producto editado con exito!';
        this.startAlert();
      }else{
        this.typeAlert = 'danger';
        this.messageAlert = '¡El producto no se pudo editar!';
        this.startAlert();
      }
    })
  }

  onSubmit() {
    if (this.createForm.valid) {
      this.optionCreateEdit === 1 ? this.create() : this.edit()
    }
  }
}
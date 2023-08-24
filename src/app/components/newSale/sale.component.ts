import { Component, OnInit } from "@angular/core";
import { APIservice } from "../../shared/services/API.services/API.service";
import { DataProduct } from "../../shared/models/productsModel/products.model";
import { DataClient } from "../../shared/models/clientsModel/clients.model";
import { ProductsSelect } from "../../shared/models/saleModel/sale.model";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataSale } from "../../shared/models/saleModel/sale.model";

@Component({
  selector: 'sale-component',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})

export class saleComponent implements OnInit{
  constructor(private api: APIservice){}
  products:DataProduct[] = [];
  clients:DataClient[]= [];
  import_total:string = '0.00';
  selectedDate: NgbDateStruct | null = null;

  productsLiveSearch:DataProduct[]= [];
  inputValueSearchProduct:string = '';
  clientsLiveSearch:DataClient[]= [];
  inputValueSearchClient:string = '';

  productsSelected:ProductsSelect[] = [];
  id_client:number = 0;
  name_client:string = '';

  openAlert:boolean = false;
  typeAlert:string = '';
  messageAlert:string = '';

  startAlert(){
    this.openAlert = true;
    setTimeout(() => {
      this.openAlert = false;
    }, 3500);
  }

  ngOnInit(): void {
    this.getProducts();
    this.getClients();
  }

  getProducts(){
    this.api.getData('/productos').subscribe(data=>{
      this.products = data.data;
    })
  }

  getClients(){
    this.api.getData('/clientes').subscribe(data=>{
      this.clients = data.data;
    })
  }

  searchProducts(){
    const newArray = this.products.filter((product)=>{
      let nameProduct = product.nombre?.toLocaleLowerCase();
      let inputValue = this.inputValueSearchProduct.toLowerCase();
      return nameProduct?.includes(inputValue);
    })
    this.inputValueSearchProduct!=='' ?
    this.productsLiveSearch = newArray :
    this.productsLiveSearch = []
  }

  searchClients(){
    const newArray = this.clients.filter((client)=>{
      let nameClient = client.nombre?.toLocaleLowerCase();
      let inputValue = this.inputValueSearchClient.toLowerCase();
      return nameClient?.includes(inputValue);
    })
    this.inputValueSearchClient!=='' ?
    this.clientsLiveSearch = newArray :
    this.clientsLiveSearch = []
  }

  selectProduct(id:any,precio:any,nombre:any){
    const itemId:number = this.productsSelected.findIndex((item)=>item.producto_id === id)
    if(itemId === -1){
      this.productsSelected.push({
        producto_id: id,
        nombre: nombre,
        precio_unitario: precio,
        cantidad: 1,
        importe_total: precio
      })
      this.importTotal();
    }else{
      this.itemChangedImport(itemId, 'suma');
    }
    this.productsLiveSearch = [];
  }

  selectClient(id:any, name:any){
    this.clientsLiveSearch = [];
    this.id_client = id;
    this.name_client = name;
  }

  itemChangedImport(index:any, operation:any){
    const item = this.productsSelected[index];
    if(item.cantidad && item.precio_unitario){
      const newCant = operation === 'suma' ? item.cantidad + 1 : item.cantidad - 1;
      const price_unit = parseFloat(item.precio_unitario);
      const price_total = price_unit * newCant;
      const price_totalFormated = price_total.toFixed(2);
      this.productsSelected[index].cantidad = newCant;
      this.productsSelected[index].importe_total = price_totalFormated;
      this.importTotal();
    }
  }

  incrementDecrement(value:string , index:number){
    if(value === 'suma'){
      this.itemChangedImport(index, value);
    }else if(value === 'resta'){
      if(this.productsSelected[index].cantidad === 1){
        this.productsSelected.splice(index,1);
        this.importTotal();
      }else{
        this.itemChangedImport(index, 'resta');
      }
    }
  }

  importTotal(){
    let total:number = 0;
    this.productsSelected.map((item)=>{
      if(item.importe_total){
        total = total + parseFloat(item.importe_total);
      }
    })
    this.import_total = total.toFixed(2);
  }

  removeClient(){
    this.id_client = 0;
    this.name_client = '';
  }

  onDateSelection(date:NgbDateStruct) {
    this.selectedDate = date;
  }

  createSale(){
    const payload:DataSale={
      cliente_id: this.id_client,
      fecha: `${this.selectedDate?.year}/${this.selectedDate?.month}/${this.selectedDate?.day}`,
      importe_total: parseFloat(this.import_total),
      items: this.productsSelected,
      observaciones: 'ejemplo'
    }
    this.api.createData(payload, '/ventas').subscribe((data)=>{
      if(data.success){
        this.typeAlert = 'success';
        this.messageAlert = '¡La venta se realizó con exito!';
        this.startAlert();
      }else{
        this.typeAlert = 'warning';
        this.messageAlert = '¡La venta no se realizó correctamente!';
        this.startAlert();
      }
      console.log(data)
    })
  }

}
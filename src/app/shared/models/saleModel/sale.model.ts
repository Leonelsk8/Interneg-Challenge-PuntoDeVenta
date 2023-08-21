export interface ProductsSelect{
  producto_id?:number;
  cantidad?:number;
  importe_total?:string;
  nombre?:string;
  precio_unitario?:string;
}

export interface Sale{
  fecha?:string|any;
  cliente_id?:number;
  importe_total?:number;
  observaciones?:string;
  items?:ProductsSelect[];
}
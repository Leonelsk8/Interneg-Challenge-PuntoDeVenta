import { DataClient } from "../clientsModel/clients.model";
import { DataProduct } from "../productsModel/products.model";

export interface ProductsSelect{
  producto_id?:number;
  id?:number;
  cantidad?:number;
  importe_total?:string;
  nombre?:string;
  precio_unitario?:string;
  created_at?:string;
  updated_at?:string;
  venta_id?:number;
  producto?:DataProduct;
}

interface Pagination{
  actualPage?:number;
  nextPage?:number;
  prevPage?:number;
  resultPerPage?: number;
  totalPages?:number;
  totalResults?:number;
}

export interface Sale{
  fecha?:string|any;
  cliente_id?:number;
  cliente?:DataClient;
  id?:number;
  importe_total?:number;
  observaciones?:string;
  items?:ProductsSelect[];
  created_at?:string;
  numero?:string;
  updated_at?:string;
}

export interface SaleModel{
  data?:Sale[];
  pagination?:Pagination;
}
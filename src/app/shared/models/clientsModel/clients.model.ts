export interface DataClient{
  nombre?:string;
  cuit?:string;
  cuit_formateado?:string;
  email?:number;
  id?:number;
  domicilio?:string;
  telefono?:string;
  created_at?:string;
  updated_at?:string;
}

interface Pagination{
  actualPage?:number;
  nextPage?:number;
  prevPage?:number;
  resultPerPage?: number;
  totalPages?:number;
  totalResults?:number;
}

export interface Clients{
  data?:DataClient[];
  pagination?:Pagination;
}
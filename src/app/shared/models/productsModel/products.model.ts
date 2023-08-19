export interface DataProduct{
  nombre?:string;
  codigo?:string;
  precio?:number;
  id?:number;
  numero?:string;
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

export interface Products{
  data?:DataProduct[];
  pagination?:Pagination;
}
interface Pagination{
  actualPage?:number;
  nextPage?:number;
  prevPage?:number;
  resultPerPage?: number;
  totalPages?:number;
  totalResults?:number;
}

export interface ElementModel<T>{
  data?: T[];
  pagination?:Pagination;
}
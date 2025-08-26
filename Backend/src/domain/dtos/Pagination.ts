export interface PaginationDTO<T = any> {
  
  body: T[];

 
  total: number;


  page: number;


  last_page: number;
}
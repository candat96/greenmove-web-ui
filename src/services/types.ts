import { HttpStatusCode } from "axios";

export interface CommonResponse<T> {
  data: T;
}

export type QueryObject = { [key: string]: any };

export interface APIResponse<T = any> {
  statusCode: HttpStatusCode;
  data: T;
  pagination?: Pagination;
  message: string;
}


export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

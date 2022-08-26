import { ISwaggerPathItem } from "./swagger-path-item.interface";

export interface ISwaggerCallback {
  [expression: string]: ISwaggerPathItem;
}

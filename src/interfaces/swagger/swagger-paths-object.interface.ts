import { ISwaggerPathItem } from "./swagger-path-item.interface";

export interface ISwaggerPathsObject {
  [path: string]: ISwaggerPathItem;
}

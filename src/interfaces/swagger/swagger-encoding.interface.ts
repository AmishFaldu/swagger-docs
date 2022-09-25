import { SwaggerStyleType } from "../types";
import { ISwaggerHeader } from "./swagger-header.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";

export interface ISwaggerEncoding {
  contentType?: string;
  headers?: {
    [key: string]: ISwaggerHeader | ISwaggerReferenceSchema;
  };
  style?: SwaggerStyleType;
  explode?: boolean;
  allowReserved?: boolean;
}

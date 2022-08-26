import { ISwaggerHeader } from "./swagger-header.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { SwaggerStyleType } from "./types/swagger-stype.type";

export interface ISwaggerEncoding {
  contentType?: string;
  headers?: {
    [key: string]: ISwaggerHeader | ISwaggerReferenceSchema;
  };
  style?: SwaggerStyleType;
  explode?: boolean;
  allowReserved?: boolean;
}

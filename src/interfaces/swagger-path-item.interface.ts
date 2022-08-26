import { ISwaggerOperation } from "./swagger-operation.interface";
import { ISwaggerParameter } from "./swagger-parameter.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerServer } from "./swagger-server.interface";

export interface ISwaggerPathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: ISwaggerOperation;
  put?: ISwaggerOperation;
  post?: ISwaggerOperation;
  delete?: ISwaggerOperation;
  options?: ISwaggerOperation;
  head?: ISwaggerOperation;
  patch?: ISwaggerOperation;
  trace?: ISwaggerOperation;
  servers?: ISwaggerServer[];
  parameters?: ISwaggerParameter | ISwaggerReferenceSchema;
}

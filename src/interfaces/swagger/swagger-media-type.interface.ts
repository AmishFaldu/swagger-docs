import { ISwaggerEncoding } from "./swagger-encoding.interface";
import { ISwaggerExample } from "./swagger-example.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerSchema } from "./swagger-schema.interface";

export interface ISwaggerMediaType {
  schema?: ISwaggerReferenceSchema | ISwaggerSchema;
  example?: unknown;
  examples?: {
    [key: string]: ISwaggerExample | ISwaggerReferenceSchema;
  };
  encoding?: {
    [key: string]: ISwaggerEncoding;
  };
}

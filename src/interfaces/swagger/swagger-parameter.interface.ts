import { SwaggerParameterInType, SwaggerStyleType } from "../types";
import { ISwaggerExample } from "./swagger-example.interface";
import { ISwaggerMediaType } from "./swagger-media-type.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerSchema } from "./swagger-schema.interface";

export interface ISwaggerParameter {
  name: string;
  in: SwaggerParameterInType;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: SwaggerStyleType;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: ISwaggerSchema | ISwaggerReferenceSchema;
  example?: any;
  examples?: {
    [key: string]: ISwaggerExample | ISwaggerReferenceSchema;
  };
  content?: {
    [key: string]: ISwaggerMediaType;
  };
}

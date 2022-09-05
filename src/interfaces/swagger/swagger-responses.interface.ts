import { ISwaggerHeader } from "./swagger-header.interface";
import { ISwaggerLink } from "./swagger-link.interface";
import { ISwaggerMediaType } from "./swagger-media-type.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";

interface ISwaggerResponse {
  description: string;
  headers?: {
    [key: string]: ISwaggerHeader | ISwaggerReferenceSchema;
  };
  content?: {
    [key: string]: ISwaggerMediaType;
  };
  links?: {
    [key: string]: ISwaggerLink | ISwaggerReferenceSchema;
  };
}

export interface ISwaggerResponses {
  [httpStatusCodes: string]: ISwaggerReferenceSchema | ISwaggerResponse | undefined;
  default?: ISwaggerReferenceSchema | ISwaggerResponse;
}

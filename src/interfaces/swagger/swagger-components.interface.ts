import { ISwaggerCallback } from "./swagger-callback.interface";
import { ISwaggerExample } from "./swagger-example.interface";
import { ISwaggerHeader } from "./swagger-header.interface";
import { ISwaggerLink } from "./swagger-link.interface";
import { ISwaggerParameter } from "./swagger-parameter.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerRequestBody } from "./swagger-request-body.interface";
import { ISwaggerResponses } from "./swagger-responses.interface";
import { ISwaggerSchema } from "./swagger-schema.interface";
import { ISwaggerSecurityScheme } from "./swagger-security-scheme.interface";

export interface ISwaggerComponents {
  schemas?: {
    [schemaname: string]: ISwaggerReferenceSchema | ISwaggerSchema;
  };
  responses?: {
    [responsename: string]: ISwaggerReferenceSchema | ISwaggerResponses;
  };
  parameters?: {
    [paraname: string]: ISwaggerParameter | ISwaggerReferenceSchema;
  };
  examples?: {
    [name: string]: ISwaggerExample | ISwaggerReferenceSchema;
  };
  requestBodies?: {
    [name: string]: ISwaggerReferenceSchema | ISwaggerRequestBody;
  };
  headers?: {
    [name: string]: ISwaggerHeader | ISwaggerReferenceSchema;
  };
  securitySchemes?: {
    [name: string]: ISwaggerReferenceSchema | ISwaggerSecurityScheme;
  };
  links?: {
    [name: string]: ISwaggerLink | ISwaggerReferenceSchema;
  };
  callbacks?: {
    [name: string]: ISwaggerCallback | ISwaggerReferenceSchema;
  };
}

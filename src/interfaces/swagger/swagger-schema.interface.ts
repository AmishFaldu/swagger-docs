import { ISwaggerDiscriminator } from "./swagger-discriminator.interface";
import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerXML } from "./swagger-xml.interface";

export type DataTypesSuported =
  "array" | "boolean" | "integer" | "number" | "object" | "string";

type DataTypeFormatsSupported =
  "binary" | "byte" | "date-time" | "date" | "double" | "float" | "int32" | "int64" | "password";

export interface ISwaggerSchema {
  title?: string;
  multipleOf?: string;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[] | boolean;
  enum?: readonly string[];
  type?: DataTypesSuported;
  allOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  oneOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  anyOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  not?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  items?: ISwaggerReferenceSchema | ISwaggerSchema;
  properties?: {
    [key: string]: ISwaggerReferenceSchema | ISwaggerSchema;
  };
  additionalProperties?: ISwaggerReferenceSchema | ISwaggerSchema | boolean;
  description?: string;
  format?: DataTypeFormatsSupported;
  default?: unknown;
  nullable?: boolean;
  discriminator?: ISwaggerDiscriminator;
  readOnly?: boolean;
  writeOnly?: string;
  xml?: ISwaggerXML;
  externalDocs?: ISwaggerExternalDocs;
  example?: unknown;
  deprecated?: boolean;
}

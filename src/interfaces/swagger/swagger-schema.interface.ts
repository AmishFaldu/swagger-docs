import { ISwaggerDiscriminator } from "./swagger-discriminator.interface";
import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerXML } from "./swagger-xml.interface";

type DataTypesSuported =
  "array" | "boolean" | "integer" | "number" | "objeect" | "string";

type DataTypeFormatsSupported =
  "binary" | "byte" | "date-time" | "date" | "double" | "float" | "int32" | "int64" | "password";

export interface ISwaggerSchema {
  title?: string;
  multipleOf?: string;
  maximum?: string;
  exclusiveMaximum?: string;
  minimum?: string;
  exclusiveMinimum?: string;
  maxLength?: string;
  minLength?: string;
  pattern?: string;
  maxItems?: string;
  minItems?: string;
  uniqueItems?: string;
  maxProperties?: string;
  minProperties?: string;
  required?: string[] | boolean;
  enum?: string[];
  type: DataTypesSuported;
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

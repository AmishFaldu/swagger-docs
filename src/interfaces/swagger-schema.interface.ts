import { ISwaggerDiscriminator } from "./swagger-discriminator.interface";
import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerXML } from "./swagger-xml.interface";

type DataTypesSuported =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "array"
  | "objeect";

type DataTypeFormatsSupported =
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "byte"
  | "binary"
  | "date"
  | "date-time"
  | "password";

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
  required?: boolean | string[];
  enum?: string[];
  type: DataTypesSuported;
  allOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  oneOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  anyOf?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  not?: (ISwaggerReferenceSchema | ISwaggerSchema)[];
  items?: ISwaggerReferenceSchema | ISwaggerSchema;
  properties?: {
    [key: string]: ISwaggerSchema | ISwaggerReferenceSchema;
  };
  additionalProperties?: boolean | ISwaggerSchema | ISwaggerReferenceSchema;
  description?: string;
  format?: DataTypeFormatsSupported | string;
  default?: any;
  nullable?: boolean;
  discriminator?: ISwaggerDiscriminator;
  readOnly?: boolean;
  writeOnly?: string;
  xml?: ISwaggerXML;
  externalDocs?: ISwaggerExternalDocs;
  example?: any;
  deprecated?: boolean;
}

import { ISwaggerCallback } from "./swagger-callback.interface";
import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";
import { ISwaggerParameter } from "./swagger-parameter.interface";
import { ISwaggerReferenceSchema } from "./swagger-reference-schema.interface";
import { ISwaggerRequestBody } from "./swagger-request-body.interface";
import { ISwaggerResponses } from "./swagger-responses.interface";
import { ISwaggerSecurityRequirement } from "./swagger-security-requirement.interface";
import { ISwaggerServer } from "./swagger-server.interface";

export interface ISwaggerOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ISwaggerExternalDocs;
  operationId?: string;
  parameters?: (ISwaggerParameter | ISwaggerReferenceSchema)[];
  requestBody?: ISwaggerRequestBody | ISwaggerReferenceSchema;
  responses: ISwaggerResponses;
  callbacks?: {
    [key: string]: ISwaggerCallback | ISwaggerReferenceSchema;
  };
  deprecated?: boolean;
  security?: ISwaggerSecurityRequirement[];
  servers?: ISwaggerServer;
}

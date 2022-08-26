import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";

export interface ISwaggerTag {
  name: string;
  description?: string;
  externalDocs?: ISwaggerExternalDocs;
}

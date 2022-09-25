import { ISwaggerComponents } from "./swagger-components.interface";
import { ISwaggerExternalDocs } from "./swagger-external-docs.interface";
import { ISwaggerInfo } from "./swagger-info.interface";
import { ISwaggerPathsObject } from "./swagger-paths-object.interface";
import { ISwaggerSecurityRequirement } from "./swagger-security-requirement.interface";
import { ISwaggerServer } from "./swagger-server.interface";
import { ISwaggerTag } from "./swagger-tag.interface";

export interface ISwaggerConfig {
  openapi: string;
  info: ISwaggerInfo;
  servers?: ISwaggerServer;
  paths: ISwaggerPathsObject;
  components: ISwaggerComponents;
  security?: ISwaggerSecurityRequirement[];
  tags?: ISwaggerTag[];
  externalDocs?: ISwaggerExternalDocs;
}

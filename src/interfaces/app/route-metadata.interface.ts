import { SWAGGER_METADATA_DECORATOR_METADATA_ENUM } from "../../constants/decorator.constants";
import {
  ISwaggerExternalDocs,
  ISwaggerSecurityRequirement,
  ISwaggerServer,
} from "../swagger";
import { DeepReadonly } from "../types";

export interface ISwaggerRouteTagsMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.TAG;
  value: string[];
}

export interface ISwaggerRouteDeprecatedMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DEPRECATED;
  value: boolean;
}

export interface ISwaggerRouteSummaryMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SUMMARY;
  value: string;
}

export interface ISwaggerRouteDescriptionMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DESCRIPTION;
  value: string;
}

export interface ISwaggerRouteExternalDocssMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.EXTERNAL_DOCS;
  value: ISwaggerExternalDocs;
}

export interface ISwaggerRouteServersMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SERVERS;
  value: ISwaggerServer[];
}

export interface ISwaggerRouteSecurityMetadata {
  metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SECURITY;
  value: DeepReadonly<ISwaggerSecurityRequirement[]>;
}

export type IRouteMetadata =
  | ISwaggerRouteDeprecatedMetadata
  | ISwaggerRouteDescriptionMetadata
  | ISwaggerRouteExternalDocssMetadata
  | ISwaggerRouteSecurityMetadata
  | ISwaggerRouteServersMetadata
  | ISwaggerRouteSummaryMetadata
  | ISwaggerRouteTagsMetadata;

export interface ISwaggerRouteMetadata {
  tags?: string[];
  deprecated?: boolean;
  summary?: string;
  description?: string;
  externalDocs?: ISwaggerExternalDocs;
  servers?: ISwaggerServer[];
  security?: ISwaggerSecurityRequirement[];
}

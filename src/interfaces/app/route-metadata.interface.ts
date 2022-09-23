import {
  ISwaggerExternalDocs,
  ISwaggerSecurityRequirement,
  ISwaggerServer,
} from "../swagger";
import { DeepReadonly } from "../types";

export interface ISwaggerRouteTagsMetadata {
  metadataType: "tags";
  value: string[];
}

export interface ISwaggerRouteDeprecatedMetadata {
  metadataType: "deprecated";
  value: boolean;
}

export interface ISwaggerRouteSummaryMetadata {
  metadataType: "summary";
  value: string;
}

export interface ISwaggerRouteDescriptionMetadata {
  metadataType: "description";
  value: string;
}

export interface ISwaggerRouteExternalDocssMetadata {
  metadataType: "externalDocs";
  value: ISwaggerExternalDocs;
}

export interface ISwaggerRouteServersMetadata {
  metadataType: "servers";
  value: ISwaggerServer[];
}

export interface ISwaggerRouteSecurityMetadata {
  metadataType: "security";
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

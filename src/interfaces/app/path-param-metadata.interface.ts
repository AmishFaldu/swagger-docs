import { DECORATOR_METADATA_ENUM } from "../../constants/decorator.constants";

export interface IPathParamMetadata {
  paramname: string;
  required?: boolean;
}

export type DataRouteArgType =
  | DECORATOR_METADATA_ENUM.HEADER
  | DECORATOR_METADATA_ENUM.PATH_PARAM
  | DECORATOR_METADATA_ENUM.QUERY_PARAM;

export type NonDataRouteArgType =
  | DECORATOR_METADATA_ENUM.BODY
  | DECORATOR_METADATA_ENUM.NEXT
  | DECORATOR_METADATA_ENUM.REQUEST
  | DECORATOR_METADATA_ENUM.RESPONSE;

export interface IDataRouteArgMetadata {
  type: DataRouteArgType;
  data: IPathParamMetadata;
}

export interface IFileDataRouteArgMetadata {
  type: DECORATOR_METADATA_ENUM.FILE;
  data: IPathParamMetadata;
  options?: { minFiles?: number; maxFiles?: number; required?: boolean };
}

export interface INoDataRouteArgMetadata {
  type: NonDataRouteArgType;
}

export type IRouteArgMetadata =
  | IDataRouteArgMetadata
  | IFileDataRouteArgMetadata
  | INoDataRouteArgMetadata;

import { DECORATOR_METADATA_ENUM } from "../../constants/decorator.constants";

export interface IPathParamMetadata {
  paramname: string;
}

export type DataRouteArgType =
  | DECORATOR_METADATA_ENUM.FILE
  | DECORATOR_METADATA_ENUM.FILES
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

export interface INoDataRouteArgMetadata {
  type: NonDataRouteArgType;
}

export type IRouteArgMetadata = IDataRouteArgMetadata | INoDataRouteArgMetadata;

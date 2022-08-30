export interface IPathParamMetadata {
  paramname?: string;
}

export interface IRouteArgMetadata {
  type: string;
  data: IPathParamMetadata;
  returntype: string;
}

import "reflect-metadata";
import { IPathParamMetadata, IRouteArgMetadata } from "src/interfaces";
import { DECORATOR_METADATA_ENUM } from "../constants";

const paramDecorator = (type: string, data: IPathParamMetadata = {}) => {
  return (target: Object, key: string, index: number) => {
    const returnTypes = Reflect.getMetadata("design:paramtypes", target, key);
    const args =
      Reflect.getMetadata(DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS, target, key) ||
      {};

    const routeArgMetadata: IRouteArgMetadata = {
      type,
      data,
      returntype: returnTypes[index].name,
    };
    Reflect.defineMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      Object.assign(args, {
        [index]: routeArgMetadata,
      }),
      target,
      key
    );
  };
};

export const PathParam = (
  paramname: string
): ((target: Object, key: string, index: number) => void) => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.PATH_PARAM, pathParamMetadata);
};

export const QueryParam = (
  paramname: string
): ((target: Object, key: string, index: number) => void) => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.QUERY_PARAM, pathParamMetadata);
};

export const Body = (): ((
  target: Object,
  key: string,
  index: number
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.BODY);
};

export const Request = (): ((
  target: Object,
  key: string,
  index: number
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.REQUEST);
};

export const Response = (): ((
  target: Object,
  key: string,
  index: number
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.RESPONSE);
};

export const Next = (): ((
  target: Object,
  key: string,
  index: number
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.NEXT);
};

export const File = (
  fieldname: string
): ((target: Object, key: string, index: number) => void) => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: fieldname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.FILE, pathParamMetadata);
};

export const Files = (
  fieldname: string
): ((target: Object, key: string, index: number) => void) => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: fieldname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.FILES, pathParamMetadata);
};

export const Header = (
  propname: string
): ((target: Object, key: string, index: number) => void) => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: propname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.HEADER, pathParamMetadata);
};

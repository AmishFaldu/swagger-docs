import "reflect-metadata";
import { IPathParamMetadata, IRouteArgMetadata } from "src/interfaces";
import { DECORATOR_METADATA_ENUM } from "../constants";

/**
 * Common parameter decorator function to attach reflect metadata to route handler arguments
 * @param type - Parameter type
 * @param data - Data associated with parameter
 * @returns Typescript parameter decorator function
 */
const paramDecorator = (type: string, data: Readonly<IPathParamMetadata> = {}) => {
  return (target: Readonly<Record<string, unknown>>,
    key: Readonly<string>,
    index: Readonly<number>,
  ): void => {
    const returnTypes = Reflect.getMetadata("design:paramtypes", target, key);
    const args =
      Reflect.getMetadata(
        DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
        target,
        key,
      ) ?? {};

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
      key,
    );
  };
};

/**
 * Route path parameter decorator
 * @param paramname - Parameter nam from route path
 * @returns Parameter decorator function
 */
export const PathParam = (
  paramname: string,
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.PATH_PARAM, pathParamMetadata);
};

/**
 * Route query parameter decorator
 * @param paramname - Query parameter name
 * @returns Parameter decorator
 */
export const QueryParam = (
  paramname: string,
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.QUERY_PARAM, pathParamMetadata);
};

/**
 * Request body decorator
 * @returns Parameter decorator
 */
export const Body = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number,
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.BODY);
};

/**
 * Request Object decorator
 * @returns Parameter decorator
 */
export const Request = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number,
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.REQUEST);
};

/**
 * Response object decorator
 * @returns Parameter decorator
 */
export const Response = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number,
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.RESPONSE);
};

/**
 * Next function decorator
 * @returns Parameter decorator
 */
export const Next = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number,
) => void) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.NEXT);
};

/**
 * File from request decorator
 * @param fieldname - Field name of request in which file object will be present
 * @returns Parameter decorator
 */
export const File = (
  fieldname: string,
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: fieldname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.FILE, pathParamMetadata);
};

/**
 * Files from request decorator
 * @param fieldname - Field name of request in which files array will be present
 * @returns Parameter decorator
 */
export const Files = (
  fieldname: string,
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: fieldname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.FILES, pathParamMetadata);
};

/**
 * Request header decorator
 * @param propname - Header property name in request headers object
 * @returns Parameter decorator
 */
export const Header = (
  propname: string,
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: propname,
  };
  return paramDecorator(DECORATOR_METADATA_ENUM.HEADER, pathParamMetadata);
};

import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import {
  DeepReadonly,
  IDataRouteArgMetadata,
  IFileDataRouteArgMetadata,
  INoDataRouteArgMetadata,
  IPathParamMetadata,
  IRouteArgMetadata,
} from "../interfaces";

/**
 * Common parameter decorator function to attach reflect metadata to route handler arguments
 * @param {IRouteArgMetadata} paramDetails - Parameter details
 * @param paramData.type - Parameter type
 * @param paramData.data - Data associated with parameter
 * @returns Typescript parameter decorator function
 */
const paramDecorator = (paramDetails: DeepReadonly<IRouteArgMetadata>) => {
  return (
    target: Readonly<Record<string, unknown>>,
    key: Readonly<string>,
    index: Readonly<number>,
  ): void => {
    const args =
      Reflect.getMetadata(
        DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
        target,
        key,
      ) ?? {};

    let routeArgMetadata: IRouteArgMetadata;
    if (
      paramDetails.type === DECORATOR_METADATA_ENUM.BODY ||
      paramDetails.type === DECORATOR_METADATA_ENUM.NEXT ||
      paramDetails.type === DECORATOR_METADATA_ENUM.REQUEST ||
      paramDetails.type === DECORATOR_METADATA_ENUM.RESPONSE
    ) {
      routeArgMetadata = {
        type: paramDetails.type,
      } as INoDataRouteArgMetadata;
    } else if (paramDetails.type === DECORATOR_METADATA_ENUM.FILE) {
      routeArgMetadata = paramDetails;
    } else {
      routeArgMetadata = {
        type: paramDetails.type,
        data: (paramDetails as IDataRouteArgMetadata).data,
      } as IDataRouteArgMetadata;
    }

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
export const PathParam = (paramname: string): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator({
    type: DECORATOR_METADATA_ENUM.PATH_PARAM,
    data: pathParamMetadata,
  });
};

/**
 * Route query parameter decorator
 * @param paramname - Query parameter name
 * @returns Parameter decorator
 */
export const QueryParam = (paramname: string): ParameterDecorator => {
  const queryParamMetadata: IPathParamMetadata = {
    paramname,
  };
  return paramDecorator({
    type: DECORATOR_METADATA_ENUM.QUERY_PARAM,
    data: queryParamMetadata,
  });
};

/**
 * Request body decorator
 * @returns Parameter decorator
 */
export const Body = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number
) => void) => {
  return paramDecorator({ type: DECORATOR_METADATA_ENUM.BODY });
};

/**
 * Request Object decorator
 * @returns Parameter decorator
 */
export const Request = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number
) => void) => {
  return paramDecorator({ type: DECORATOR_METADATA_ENUM.REQUEST });
};

/**
 * Response object decorator
 * @returns Parameter decorator
 */
export const Response = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number
) => void) => {
  return paramDecorator({ type: DECORATOR_METADATA_ENUM.RESPONSE });
};

/**
 * Next function decorator
 * @returns Parameter decorator
 */
export const Next = (): ((
  target: Readonly<Record<string, unknown>>,
  key: string,
  index: number
) => void) => {
  return paramDecorator({ type: DECORATOR_METADATA_ENUM.NEXT });
};

/**
 * File from request decorator
 * @param fieldname - Field name of request in which file object will be present
 * @returns Parameter decorator
 */
export const File = (
  fieldname: string,
  options: Readonly<IFileDataRouteArgMetadata["options"]> = {
    minFiles: 1,
    maxFiles: 1,
  },
): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: fieldname,
  };
  return paramDecorator({
    type: DECORATOR_METADATA_ENUM.FILE,
    data: pathParamMetadata,
    options,
  });
};

/**
 * Request header decorator
 * @param propname - Header property name in request headers object
 * @returns Parameter decorator
 */
export const Header = (propname: string): ParameterDecorator => {
  const pathParamMetadata: IPathParamMetadata = {
    paramname: propname,
  };
  return paramDecorator({
    type: DECORATOR_METADATA_ENUM.HEADER,
    data: pathParamMetadata,
  });
};

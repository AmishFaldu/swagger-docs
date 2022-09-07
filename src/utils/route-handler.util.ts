import { ClassType } from "../app-config";
import { DECORATOR_METADATA_ENUM } from "../constants";
import {
  DeepReadonly,
  IRouteArgMetadata,
  IRouterHandlerArgs,
} from "../interfaces";

/**
 * Determine and return route handler argument value
 * @param argDetails - Route handler argument metadata
 * @param routerHandlerArgs - Arguments provided by web frameworks to a router handler
 * @param routerHandlerArgs.req - Request Object
 * @param routerHandlerArgs.res - Response Object
 * @param routerHandlerArgs.next - Next function
 * @returns Determined argument value for route handler
 */
const fetchRouteArgValue = (
  argDetails: DeepReadonly<IRouteArgMetadata>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  routerHandlerArgs: IRouterHandlerArgs,
): unknown => {
  const { next, req, res } = routerHandlerArgs;
  const argType = argDetails.type;
  switch (argType) {
    case DECORATOR_METADATA_ENUM.PATH_PARAM:
      if (argDetails.data.paramname === undefined) {
        return null;
      }
      return req.params[argDetails.data.paramname];
    case DECORATOR_METADATA_ENUM.QUERY_PARAM:
      if (argDetails.data.paramname === undefined) {
        return null;
      }
      return req.query[argDetails.data.paramname];
    case DECORATOR_METADATA_ENUM.BODY:
      return req.body;
    case DECORATOR_METADATA_ENUM.REQUEST:
      return req;
    case DECORATOR_METADATA_ENUM.RESPONSE:
      return res;
    case DECORATOR_METADATA_ENUM.NEXT:
      return next;
    case DECORATOR_METADATA_ENUM.FILE:
    case DECORATOR_METADATA_ENUM.FILES:
      if (argDetails.data.paramname === undefined) {
        return null;
      }
      return req[argDetails.data.paramname];
    case DECORATOR_METADATA_ENUM.HEADER:
      if (argDetails.data.paramname === undefined) {
        return null;
      }
      return req.header[argDetails.data.paramname];
    default:
      return null;
  }
};

/**
 * Build and generate route handler arguments which are directly passed to route handler function
 * @param controller - Controller class
 * @param routeHandlerName - Route handler method name
 * @param routerHandlerArgs - Arguments provided by web frameworks to a router handler
 * @param routerHandlerArgs.req - Request Object
 * @param routerHandlerArgs.res - Response Object
 * @param routerHandlerArgs.next - Next function
 * @returns Generated route handler arguments in array form
 */
export const generateRouteHandlerArgs = (
  controller: DeepReadonly<ClassType>,
  routeHandlerName: string,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  routerHandlerArgs: IRouterHandlerArgs,
): unknown[] => {
  let routeArgs: unknown[] = [];
  const routeArgsMappging: Record<string, IRouteArgMetadata> | undefined =
    Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      controller.prototype,
      routeHandlerName,
    );
  if (routeArgsMappging) {
    Object.keys(routeArgsMappging).forEach((argIndex: string) => {
      const intArgIndex = parseInt(argIndex, 10);

      routeArgs = [
        ...routeArgs.slice(0, intArgIndex),
        fetchRouteArgValue(routeArgsMappging[argIndex], routerHandlerArgs),
        ...routeArgs.slice(intArgIndex),
      ];
    });
  }
  return routeArgs;
};

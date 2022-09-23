import { ROUTE_DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import {
  DecoratorGeneratorType,
  DeepReadonly,
  IRouteMetadata,
  ISwaggerExternalDocs,
  ISwaggerSecurityRequirement,
  ISwaggerServer,
} from "../interfaces";

/**
 * Route property decorator wraps class and method decorator for use of decorators
 * at route and controller level
 * @param routeMetadata - Route metadata to be stored
 * @returns Either a class or method decorator,
 * if applied anywhere except class or method throws exception
 */
const routePropertyDecorator = ({
  metadataType,
  value,
}: DeepReadonly<IRouteMetadata>): DecoratorGeneratorType => {
  return (...args: Readonly<any[]>) => {
    switch (args.length) {
      case 1: {
        const target = args[0];
        const routeMetadata: IRouteMetadata =
          Reflect.getMetadata(
            ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
            target,
          ) ?? {};

        routeMetadata[metadataType] = value;
        Reflect.defineMetadata(
          ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
          routeMetadata,
          target,
        );
        return;
      }
      case 3: {
        const target = args[0];
        const property = args[1];
        if (typeof args[2] === "number") {
          throw new Error(
            `Cannot apply ${metadataType} decorator anywhere except controller and methods`,
          );
        }
        const routeMetadata: IRouteMetadata =
          Reflect.getMetadata(
            ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
            target,
            property,
          ) ?? {};

        routeMetadata[metadataType] = value;
        Reflect.defineMetadata(
          ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
          routeMetadata,
          target,
          property,
        );
        return;
      }
      case 2:
      default:
        throw new Error(
          `Cannot apply ${metadataType} decorator anywhere except controller and methods`,
        );
    }
  };
};

/**
 * Add tags to route or controller
 * @param tags - Array of string specifying tags associated with route
 * @returns Typescript decorator function
 */
export const RouteTag = (
  ...tags: Readonly<string[]>
): DecoratorGeneratorType => {
  return routePropertyDecorator({ metadataType: "tags", value: tags });
};

/**
 * Add summary to route or controller
 * @param summary - Short summary for routes
 * @returns Typescript decorator function
 */
export const RouteSummary = (summary: string): DecoratorGeneratorType => {
  return routePropertyDecorator({ metadataType: "summary", value: summary });
};

/**
 * Add description to route or controller
 * @param description - Description for routes
 * @returns Typescript decorator function
 */
export const RouteDescription = (
  description: string,
): DecoratorGeneratorType => {
  return routePropertyDecorator({
    metadataType: "description",
    value: description,
  });
};

/**
 * Add external docs to route or controller
 * @param externalDocs - External docs details
 * @returns Typescript decorator function
 */
export const RouteExternalDocs = (
  externalDocs: Readonly<ISwaggerExternalDocs>,
): DecoratorGeneratorType => {
  return routePropertyDecorator({
    metadataType: "externalDocs",
    value: externalDocs,
  });
};

/**
 * Make route or controller apis deprecated
 * @param routeDeprecated - Boolean indicating route or controller is deprecated or not
 * @returns Typescript decorator function
 */
export const RouteDeprecated = (
  routeDeprecated = true,
): DecoratorGeneratorType => {
  return routePropertyDecorator({
    metadataType: "deprecated",
    value: routeDeprecated,
  });
};

/**
 * Add security to route or controller
 * @param security - Security details
 * @returns Typescript decorator function
 */
export const RouteSecurity = (
  security: DeepReadonly<ISwaggerSecurityRequirement[]>,
): DecoratorGeneratorType => {
  return routePropertyDecorator({ metadataType: "security", value: security });
};

/**
 * Add external servers to route and controller
 * @param server - Server details
 * @returns Typescript decorator function
 */
export const RouteServers = (
  server: DeepReadonly<ISwaggerServer[]>,
): DecoratorGeneratorType => {
  return routePropertyDecorator({ metadataType: "servers", value: server });
};

// export function RouteResponseBody(
//   type: IRouteBody["type"],
//   options?: Readonly<IRouteBody["options"]>
// ): PropertyDecorator;
// export function RouteResponseBody(
//   type: any,
//   options?: Readonly<IRouteBody["options"]>
// ): PropertyDecorator;

// // eslint-disable-next-line func-style
// export function RouteResponseBody(
//   type: any,
//   options: Readonly<IRouteBody["options"]> = {},
// ): PropertyDecorator {
//   const response: IRouteBody = {
//     type,
//     options,
//   };
//   return routePropertyDecorator({
//     metadataType: ROUTE_DECORATOR_METADATA_ENUM.RESPONSE_BODY,
//     value: response,
//   });
// }

// export const RouteRequestBody = (
//   type: IRouteBody["type"],
//   options: Readonly<IRouteBody["options"]> = {},
// ): PropertyDecorator => {
//   const request: IRouteBody = {
//     type,
//     options,
//   };
//   return routePropertyDecorator(
//     ROUTE_DECORATOR_METADATA_ENUM.REQUEST_BODY,
//     request,
//   );
// };

// export const Middleware = (
//   middleware: DeepReadonly<RequestHandler>,
// ): PropertyDecorator => {
//   return routePropertyDecorator(
//     ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE,
//     middleware,
//   );
// };

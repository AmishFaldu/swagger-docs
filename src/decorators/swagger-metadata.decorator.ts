import { SWAGGER_METADATA_DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import {
  DecoratorGeneratorType,
  DeepReadonly,
  IRouteMetadata,
  ISwaggerExternalDocs,
  ISwaggerSecurityRequirement,
  ISwaggerServer,
} from "../interfaces";

/**
 * Swagger metadata decorator wraps class and method decorator for use of decorators
 * at route and controller level
 * @param routeMetadata - Route metadata to be stored
 * @returns Either a class or method decorator,
 * if applied anywhere except class or method throws exception
 */
const swaggerMetadataDecorator = ({
  metadataType,
  value,
}: DeepReadonly<IRouteMetadata>): DecoratorGeneratorType => {
  return (...args: Readonly<any[]>) => {
    switch (args.length) {
      case 1: {
        const target = args[0];
        const routeMetadata: IRouteMetadata =
          Reflect.getMetadata(
            SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
            target,
          ) ?? {};

        routeMetadata[metadataType] = value;
        Reflect.defineMetadata(
          SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
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
            SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
            target,
            property,
          ) ?? {};

        routeMetadata[metadataType] = value;
        Reflect.defineMetadata(
          SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
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
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.TAG,
    value: tags,
  });
};

/**
 * Add summary to route or controller
 * @param summary - Short summary for routes
 * @returns Typescript decorator function
 */
export const RouteSummary = (summary: string): DecoratorGeneratorType => {
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SUMMARY,
    value: summary,
  });
};

/**
 * Add description to route or controller
 * @param description - Description for routes
 * @returns Typescript decorator function
 */
export const RouteDescription = (
  description: string,
): DecoratorGeneratorType => {
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DESCRIPTION,
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
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.EXTERNAL_DOCS,
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
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DEPRECATED,
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
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SECURITY,
    value: security,
  });
};

/**
 * Add external servers to route and controller
 * @param server - Server details
 * @returns Typescript decorator function
 */
export const RouteServers = (
  server: DeepReadonly<ISwaggerServer[]>,
): DecoratorGeneratorType => {
  return swaggerMetadataDecorator({
    metadataType: SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SERVERS,
    value: server,
  });
};

import { AppConfig } from "../app-config";
import {
  DECORATOR_METADATA_ENUM,
  DTO_DECORATOR_METADATA_ENUM,
  ROUTE_DECORATOR_METADATA_ENUM,
} from "../constants/decorator.constants";
import {
  ClassType,
  DeepReadonly,
  EnumForType,
  IFileDataRouteArgMetadata,
  IRouteArgMetadata,
  IRouteBody,
  IRouterHandlerArgs,
  ISwaggerReferenceSchema,
  ISwaggerSchema,
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
      return req.params[argDetails.data.paramname];
    case DECORATOR_METADATA_ENUM.QUERY_PARAM:
      return req.query[argDetails.data.paramname];
    case DECORATOR_METADATA_ENUM.BODY:
      return req.body;
    case DECORATOR_METADATA_ENUM.REQUEST:
      return req;
    case DECORATOR_METADATA_ENUM.RESPONSE:
      return res;
    case DECORATOR_METADATA_ENUM.NEXT:
      return next;
    case DECORATOR_METADATA_ENUM.FILE: {
      const file =
        req.files === undefined
          ? undefined
          : req.files[argDetails.data.paramname];
      return file;
    }
    case DECORATOR_METADATA_ENUM.HEADER:
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

/**
 * Process dependency for a DTO class and add it to swagger schema
 * @param this - this keyword referenced to AppConfig class instance
 * @param target - DTO class, whose dependency to add in swagger schema
 * @returns void
 */
// eslint-disable-next-line func-style
function processDependenciesOfSchema(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  target: any,
): void {
  const dependencies: { type: unknown; isEnum: boolean }[] | undefined =
    Reflect.getMetadata(
      DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
      target.prototype,
    );

  if (!dependencies) {
    return;
  }

  while (dependencies.length > 0) {
    const dependency = dependencies.shift() as { type: any; isEnum: boolean };
    const nestedDependencies =
      Reflect.getMetadata(
        DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
        dependency.type.prototype,
      ) ?? [];
    dependencies.push(...nestedDependencies);

    // eslint-disable-next-line no-invalid-this
    const clonedSwaggerConfig = this.swaggerConfigCopy;

    let dtoSchema: ISwaggerSchema = {
      type: "string",
      enum: Object.values(dependency),
    };

    if (!dependency.isEnum) {
      dtoSchema = Reflect.getMetadata(
        DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA,
        dependency.type.prototype,
      ) ?? { type: "object" };
    }

    clonedSwaggerConfig.components.schemas = {
      ...(clonedSwaggerConfig.components.schemas ?? {}),
      [dependency.type.name]: dtoSchema,
    };
    // eslint-disable-next-line no-invalid-this
    this.swaggerConfigCopy = clonedSwaggerConfig;
  }
}

/**
 * This function is used to map schema from parameter type or method return type to swagger
 * @param this - this keyword referenced to AppConfig class instance
 * @param type - Type associated with method or parameter
 * @returns swagger schema type and swagger reference schema string
 */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
export function getReferenceSchema(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  type: any,
): ISwaggerReferenceSchema | ISwaggerSchema {
  let schema: ISwaggerReferenceSchema | ISwaggerSchema | undefined = undefined;
  const clonedSwaggerConfig = this.swaggerConfigCopy;

  if (
    type.name === "Object" ||
    type.name === "Boolean" ||
    type.name === "Number" ||
    type.name === "String" ||
    type.name === "Function"
  ) {
    schema = {
      $ref: `#/components/schemas/${type.name}`,
    };
  } else if (type.name === "undefined") {
    schema = {
      $ref: "#/components/schemas/Undefined",
    };
  }

  if (schema !== undefined) {
    return schema;
  }

  const dtoSchema: ISwaggerSchema = Reflect.getMetadata(
    DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA,
    type.prototype,
  ) ?? { type: "object" };
  const dtoClassName = type.name;

  schema = {
    $ref: `#/components/schemas/${dtoClassName}`,
  };

  clonedSwaggerConfig.components.schemas = {
    ...(clonedSwaggerConfig.components.schemas ?? {}),
    [dtoClassName]: dtoSchema,
  };
  this.swaggerConfigCopy = clonedSwaggerConfig;

  processDependenciesOfSchema.call(this, type);
  return schema;
}
/* eslint-enable no-invalid-this */

/**
 * Process specified route's request or response body
 * @param this - this keyword referenced to AppConfig class instance
 * @param bodyType - Route body type. To determine if it is request or response body
 * @param routeHandlerDetails - Route handler details
 * @returns Either swagger schema or undefined if no route body is specified explicitly
 */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
export function processRouteBody(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  bodyType: ROUTE_DECORATOR_METADATA_ENUM,
  routeHandlerDetails: Readonly<{
    controller: ClassType;
    routeHandlerName: string;
  }>,
): ISwaggerReferenceSchema | ISwaggerSchema | undefined {
  const routeBodyMetadata: IRouteBody | undefined = Reflect.getMetadata(
    bodyType,
    routeHandlerDetails.controller.prototype,
    routeHandlerDetails.routeHandlerName,
  );
  if (routeBodyMetadata === undefined) {
    return undefined;
  }

  let swaggerSchema: ISwaggerReferenceSchema | ISwaggerSchema | undefined;
  if (typeof routeBodyMetadata.type === typeof EnumForType) {
    swaggerSchema = {
      type: "string",
      deprecated: routeBodyMetadata.options.deprecated,
      nullable: routeBodyMetadata.options.nullable,
      required: routeBodyMetadata.options.required,
    };

    if (routeBodyMetadata.options.isArray === true) {
      swaggerSchema.type = "array";
      swaggerSchema.items = {
        type: "string",
        enum: Object.values(routeBodyMetadata.type),
      };
    } else {
      swaggerSchema.enum = Object.values(routeBodyMetadata.type);
    }
  } else if (
    routeBodyMetadata.type === "Boolean" ||
    routeBodyMetadata.type === "Number" ||
    routeBodyMetadata.type === "Object" ||
    routeBodyMetadata.type === "String" ||
    routeBodyMetadata.type === "Undefined"
  ) {
    swaggerSchema = {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      $ref: `#/components/schemas/${routeBodyMetadata.type}`,
      deprecated: routeBodyMetadata.options.deprecated,
      nullable: routeBodyMetadata.options.nullable,
      required: routeBodyMetadata.options.required,
    };

    if (routeBodyMetadata.options.isArray === true) {
      swaggerSchema = {
        type: "array",
        items: {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          $ref: `#/components/schemas/${routeBodyMetadata.type}`,
        },
        deprecated: routeBodyMetadata.options.deprecated,
        nullable: routeBodyMetadata.options.nullable,
        required: routeBodyMetadata.options.required,
      };
    }
  } else if (typeof routeBodyMetadata.type === typeof class {}) {
    swaggerSchema = {
      $ref: `#/components/schemas/${
        (routeBodyMetadata.type as ClassType).name
      }`,
      deprecated: routeBodyMetadata.options.deprecated,
      nullable: routeBodyMetadata.options.nullable,
      required: routeBodyMetadata.options.required,
    };
    if (routeBodyMetadata.options.isArray === true) {
      swaggerSchema = {
        type: "array",
        deprecated: routeBodyMetadata.options.deprecated,
        nullable: routeBodyMetadata.options.nullable,
        required: routeBodyMetadata.options.required,
        items: {
          $ref: `#/components/schemas/${
            (routeBodyMetadata.type as ClassType).name
          }`,
        },
      };
    }
    getReferenceSchema.call(this, routeBodyMetadata.type);
  } else {
    swaggerSchema = undefined;
  }

  return swaggerSchema;
}
/* eslint-enable no-invalid-this */

/**
 * Generate swagger schema for file upload in route handler
 * @param controller - Controller class
 * @param routeHandlerName - Route handler method name
 * @returns Swagger schema
 */
export const getFileSchema = (
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerSchema | undefined => {
  const swaggerFileSchema: ISwaggerSchema = {
    type: "object",
  };
  const routeArgsMappging: Record<string, IRouteArgMetadata> | undefined =
    Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      controller.prototype,
      routeHandlerName,
    );
  if (!routeArgsMappging) {
    return undefined;
  }
  const fileArgIndexes = Object.keys(routeArgsMappging).filter((index) => {
    const arg = routeArgsMappging[index];
    if (arg.type === DECORATOR_METADATA_ENUM.FILE) {
      return true;
    }
    return false;
  });
  if (fileArgIndexes.length <= 0) {
    return undefined;
  }

  fileArgIndexes.forEach((fileArgIndex) => {
    const fileArg = routeArgsMappging[
      fileArgIndex
    ] as IFileDataRouteArgMetadata;

    if ((fileArg.options?.maxFiles ?? 1) > 1) {
      swaggerFileSchema.properties = {
        ...(swaggerFileSchema.properties ?? {}),
        [fileArg.data.paramname]: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          maxItems: fileArg.options?.maxFiles,
          minItems: fileArg.options?.minFiles,
        },
      };
    } else {
      swaggerFileSchema.properties = {
        ...(swaggerFileSchema.properties ?? {}),
        [fileArg.data.paramname]: {
          type: "string",
          format: "binary",
        },
      };
    }
  });

  return swaggerFileSchema;
};

import { AppConfig } from "../app-config";
import {
  DECORATOR_METADATA_ENUM,
  ROUTE_DECORATOR_METADATA_ENUM,
  SWAGGER_METADATA_DECORATOR_METADATA_ENUM,
} from "../constants/decorator.constants";
import {
  ClassType,
  DeepReadonly,
  IRouteArgMetadata,
  ISwaggerOperation,
  ISwaggerParameter,
  ISwaggerPathItem,
  ISwaggerReferenceSchema,
  ISwaggerRequestBody,
  ISwaggerResponses,
  ISwaggerRouteMetadata,
  ISwaggerSchema,
  ISwaggerTag,
  RouteHandlerMethods,
} from "../interfaces";
import {
  getReferenceSchema,
  processRouteBody,
} from "../utils/route-handler.util";

/**
 * Generate different request parameters for swagger apis
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger api paramaters
 */
const generateSwaggerApiParameters = (
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerParameter[] | undefined => {
  const swaggerParameters: ISwaggerParameter[] = [];
  const swaggerParameterBase: Omit<ISwaggerParameter, "in" | "name"> = {
    deprecated: false,
    allowEmptyValue: false,
    description: undefined,
    // examples: {},
    required: true,
    schema: {
      type: "string",
    },
  };
  const routeArgsMappging: Record<string, IRouteArgMetadata> | undefined =
    Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      controller.prototype,
      routeHandlerName,
    );
  if (!routeArgsMappging) {
    return swaggerParameters;
  }

  Object.keys(routeArgsMappging).forEach((index: string) => {
    const routeArg = routeArgsMappging[index];
    if (routeArg.type === DECORATOR_METADATA_ENUM.PATH_PARAM) {
      swaggerParameters.push({
        ...swaggerParameterBase,
        in: "path",
        name: routeArg.data.paramname,
      });
    } else if (routeArg.type === DECORATOR_METADATA_ENUM.QUERY_PARAM) {
      swaggerParameters.push({
        ...swaggerParameterBase,
        in: "query",
        name: routeArg.data.paramname,
      });
    } else if (routeArg.type === DECORATOR_METADATA_ENUM.HEADER) {
      swaggerParameters.push({
        ...swaggerParameterBase,
        in: "header",
        name: routeArg.data.paramname,
      });
    }
  });
  return swaggerParameters;
};

/**
 * Generate swagger api request body
 * @param this - this keyword referenced to AppConfig class instance
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger request body
 */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
function generateSwaggerRequestBody(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerRequestBody | undefined {
  const routeArgsMappging: Record<string, IRouteArgMetadata> | undefined =
    Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      controller.prototype,
      routeHandlerName,
    );
  if (!routeArgsMappging) {
    return undefined;
  }
  const bodyArgIndex = Object.keys(routeArgsMappging).find((index) => {
    const arg = routeArgsMappging[index];
    if (arg.type === DECORATOR_METADATA_ENUM.BODY) {
      return true;
    }
    return false;
  });
  if (bodyArgIndex === undefined) {
    return undefined;
  }

  let schema: ISwaggerReferenceSchema | ISwaggerSchema | undefined;
  schema = processRouteBody.call(
    this,
    ROUTE_DECORATOR_METADATA_ENUM.REQUEST_BODY,
    {
      controller,
      routeHandlerName,
    },
  );

  if (schema === undefined) {
    const returnTypes = Reflect.getMetadata(
      "design:paramtypes",
      controller.prototype,
      routeHandlerName,
    );
    const bodyReturnType = returnTypes[parseInt(bodyArgIndex, 10)];
    schema = getReferenceSchema.call(this, bodyReturnType);
  }
  const swaggerRequestBody: ISwaggerRequestBody = {
    content: {
      "application/json": {
        schema,
        // examples: {},
      },
    },
    required: true,
    description: undefined,
  };
  return swaggerRequestBody;
}
/* eslint-enable no-invalid-this */

/**
 * Generate swagger api response body
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger response
 */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
function generateSwaggerResponses(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerResponses {
  let schema: ISwaggerReferenceSchema | ISwaggerSchema | undefined;
  schema = processRouteBody.call(
    this,
    ROUTE_DECORATOR_METADATA_ENUM.RESPONSE_BODY,
    {
      controller,
      routeHandlerName,
    },
  );

  if (schema === undefined) {
    const returnType = Reflect.getMetadata(
      "design:returntype",
      controller.prototype,
      routeHandlerName,
    );
    schema = getReferenceSchema.call(this, returnType);
  }
  const swaggerApiResponses: ISwaggerResponses = {
    "200": {
      description: "Success",
      content: {
        "application/json": {
          schema,
          // examples: {},
        },
      },
    },
  };

  return swaggerApiResponses;
}
/* eslint-enable no-invalid-this */

/**
 * Get route handler metadata like tags, security, deprecated, etc
 * @param controller - Controller class
 * @param routeHandlerName - Class controller's method name
 * @returns Swagger route metadata or undefined
 */
const getRouteMetadata = (
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerRouteMetadata | undefined => {
  let routeMetadata: ISwaggerRouteMetadata | undefined =
    Reflect.getMetadata(
      SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
      controller,
    ) ?? {};
  routeMetadata = {
    ...routeMetadata,
    ...(Reflect.getMetadata(
      SWAGGER_METADATA_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
      controller.prototype,
      routeHandlerName,
    ) ?? {}),
  };
  return routeMetadata;
};

/**
 * Generates swagget path operation object
 * @param this - this keyword referenced to AppConfig class instance
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns Swagger operation object
 */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
function generateSwaggerPathOperation(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerOperation {
  const swaggerApiParameters = generateSwaggerApiParameters(
    controller,
    routeHandlerName,
  );
  const swaggerApiRequestBody = generateSwaggerRequestBody.call(
    this,
    controller,
    routeHandlerName,
  );
  const swaggerApiResponses = generateSwaggerResponses.call(
    this,
    controller,
    routeHandlerName,
  );

  const routeMetadata = getRouteMetadata(controller, routeHandlerName);
  let swaggerPathOperation: ISwaggerOperation = {
    responses: swaggerApiResponses,
    parameters: swaggerApiParameters,
    requestBody: swaggerApiRequestBody,
  };
  if (routeMetadata?.tags) {
    const swaggerConfigCopy = this.swaggerConfigCopy;
    const tags = swaggerConfigCopy.tags ?? [];

    const uniqueTags = {};
    tags.forEach((tag: DeepReadonly<ISwaggerTag>) => {
      uniqueTags[tag.name] = "tag";
    });
    routeMetadata.tags.forEach((tag) => {
      uniqueTags[tag] = "tag";
    });
    Object.keys(uniqueTags).forEach((tag) => {
      tags.push({ name: tag });
    });

    this.swaggerConfigCopy = { ...this.swaggerConfigCopy, tags };
  }

  if (routeMetadata) {
    swaggerPathOperation = { ...swaggerPathOperation, ...routeMetadata };
  }

  return swaggerPathOperation;
}
/* eslint-enable no-invalid-this */

/**
 * An mapping object to map different controller methods to swagger
 *
 * **NOTE - This mapping object's functions should always bind to AppConfig class
 * This is because we need to change swagger configuration object in AppConfig**
 */
export const swaggerPathsMapping: Record<
  RouteHandlerMethods,
  (controller: ClassType, routeHandlerName: string) => ISwaggerPathItem
> = {
  DELETE(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );
    const swaggerPathObject: ISwaggerPathItem = {
      delete: swaggerOperation,
    };
    return swaggerPathObject;
  },
  GET(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );
    const swaggerPathObject: ISwaggerPathItem = {
      get: swaggerOperation,
    };
    return swaggerPathObject;
  },
  HEAD(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      head: swaggerOperation,
    };
    return swaggerPathObject;
  },
  OPTIONS(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      options: swaggerOperation,
    };
    return swaggerPathObject;
  },
  PATCH(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      patch: swaggerOperation,
    };
    return swaggerPathObject;
  },
  POST(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      post: swaggerOperation,
    };
    return swaggerPathObject;
  },
  PUT(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      put: swaggerOperation,
    };
    return swaggerPathObject;
  },
  TRACE(controller: ClassType, routeHandlerName: string) {
    const swaggerOperation = generateSwaggerPathOperation.call(
      this,
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      trace: swaggerOperation,
    };
    return swaggerPathObject;
  },
};

import { ClassType } from "../app-config";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import {
  IRouteArgMetadata,
  ISwaggerParameter,
  ISwaggerPathItem,
  ISwaggerRequestBody,
  ISwaggerResponses,
  RouteHandlerMethods,
} from "../interfaces";

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
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger request body
 */
const generateSwaggerRequestBody = (
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerRequestBody | undefined => {
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

  const swaggerRequestBody: ISwaggerRequestBody = {
    content: {
      "application/json": {
        schema: {
          type: "object",
          // $ref: "",
        },
        // examples: {},
      },
    },
    required: true,
    description: undefined,
  };
  const returnTypes = Reflect.getMetadata(
    "design:paramtypes",
    controller.prototype,
    routeHandlerName,
  );
  const bodyReturnType = returnTypes[parseInt(bodyArgIndex, 10)];
  return swaggerRequestBody;
};

/**
 * Generate swagger api response body
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger response
 */
const generateSwaggerResponses = (
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerResponses => {
  const swaggerApiResponses: ISwaggerResponses = {
    "200": {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              type: { type: "string" },
            },
          },
          // examples: {},
        },
      },
    },
  };
  const returnTypes = Reflect.getMetadata(
    "design:returntype",
    controller.prototype,
    routeHandlerName,
  );
  return swaggerApiResponses;
};

/**
 * An mapping object to map different controller methods to swagger
 */
export const swaggerPathsMapping: Record<
  RouteHandlerMethods,
  (controller: ClassType, routeHandlerName: string) => ISwaggerPathItem
> = {
  DELETE: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      delete: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  GET: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      get: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  HEAD: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      head: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  OPTIONS: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      options: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  PATCH: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      patch: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  POST: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      post: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  PUT: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      put: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
  TRACE: (controller: ClassType, routeHandlerName: string) => {
    const swaggerApiParameters = generateSwaggerApiParameters(
      controller,
      routeHandlerName,
    );
    const swaggerApiRequestBody = generateSwaggerRequestBody(
      controller,
      routeHandlerName,
    );
    const swaggerApiResponses = generateSwaggerResponses(
      controller,
      routeHandlerName,
    );

    const swaggerPathObject: ISwaggerPathItem = {
      trace: {
        responses: swaggerApiResponses,
        parameters: swaggerApiParameters,
        requestBody: swaggerApiRequestBody,
        security: [{}],
        tags: [],
        deprecated: false,
        summary: undefined,
        description: undefined,
      },
    };
    return swaggerPathObject;
  },
};

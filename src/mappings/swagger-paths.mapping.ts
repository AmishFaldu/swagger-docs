import { AppConfig, ClassType } from "../app-config";
import {
  DECORATOR_METADATA_ENUM,
  DTO_DECORATOR_METADATA_ENUM,
  ROUTE_DECORATOR_METADATA_ENUM,
} from "../constants/decorator.constants";
import {
  DataTypesSuported,
  DeepReadonly,
  IGetReferenceSchema,
  IRouteArgMetadata,
  ISwaggerOperation,
  ISwaggerParameter,
  ISwaggerPathItem,
  ISwaggerRequestBody,
  ISwaggerResponses,
  ISwaggerRouteMetadata,
  ISwaggerSchema,
  ISwaggerTag,
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
function getReferenceSchema(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  type: any,
): IGetReferenceSchema {
  let schemaType: DataTypesSuported | undefined = undefined;
  let referenceSchema: string | undefined = undefined;
  const clonedSwaggerConfig = this.swaggerConfigCopy;

  if (type.name === "Object") {
    schemaType = "object";
    referenceSchema = "#/components/schemas/Object";
  } else if (type.name === "Boolean") {
    schemaType = "boolean";
    referenceSchema = "#/components/schemas/Boolean";
  } else if (type.name === "Number") {
    schemaType = "number";
    referenceSchema = "#/components/schemas/Number";
  } else if (type.name === "String") {
    schemaType = "string";
    referenceSchema = "#/components/schemas/String";
  } else if (type.name === "Function") {
    schemaType = "string";
    referenceSchema = "#/components/schemas/Function";
  } else if (type.name === "undefined") {
    schemaType = "string";
    referenceSchema = "#/components/schemas/Undefined";
  }

  if (schemaType !== undefined && referenceSchema !== undefined) {
    return { schemaType, referenceSchema };
  }

  const dtoSchema: ISwaggerSchema = Reflect.getMetadata(
    DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA,
    type.prototype,
  ) ?? { type: "object" };
  const dtoClassName = type.name;
  schemaType = "object";
  referenceSchema = `#/components/schemas/${dtoClassName}`;

  clonedSwaggerConfig.components.schemas = {
    ...(clonedSwaggerConfig.components.schemas ?? {}),
    [dtoClassName]: dtoSchema,
  };
  this.swaggerConfigCopy = clonedSwaggerConfig;

  processDependenciesOfSchema.call(this, type);

  return { schemaType, referenceSchema };
}
/* eslint-enable no-invalid-this */

/**
 * Generate swagger api request body
 * @param this - this keyword referenced to AppConfig class instance
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger request body
 */
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

  const returnTypes = Reflect.getMetadata(
    "design:paramtypes",
    controller.prototype,
    routeHandlerName,
  );
  const bodyReturnType = returnTypes[parseInt(bodyArgIndex, 10)];

  const { schemaType, referenceSchema } = getReferenceSchema.call(
    // eslint-disable-next-line no-invalid-this
    this,
    bodyReturnType,
  ) as IGetReferenceSchema;
  const swaggerRequestBody: ISwaggerRequestBody = {
    content: {
      "application/json": {
        schema: {
          type: schemaType,
          $ref: referenceSchema,
        },
        // examples: {},
      },
    },
    required: true,
    description: undefined,
  };
  return swaggerRequestBody;
}

/**
 * Generate swagger api response body
 * @param controller - Controller class
 * @param routeHandlerName - Controller class's method name
 * @returns object containing swagger response
 */
// eslint-disable-next-line func-style
function generateSwaggerResponses(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  this: AppConfig,
  controller: ClassType,
  routeHandlerName: string,
): ISwaggerResponses {
  const returnType = Reflect.getMetadata(
    "design:returntype",
    controller.prototype,
    routeHandlerName,
  );

  const { schemaType, referenceSchema } = getReferenceSchema.call(
    // eslint-disable-next-line no-invalid-this
    this,
    returnType,
  ) as IGetReferenceSchema;
  const swaggerApiResponses: ISwaggerResponses = {
    "200": {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: schemaType,
            $ref: referenceSchema,
          },
          // examples: {},
        },
      },
    },
  };

  return swaggerApiResponses;
}

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
      ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
      controller,
    ) ?? {};
  routeMetadata = {
    ...routeMetadata,
    ...(Reflect.getMetadata(
      ROUTE_DECORATOR_METADATA_ENUM.ROUTE_METADATA,
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

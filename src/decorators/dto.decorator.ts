import "reflect-metadata";
import { deepCopyObject } from "../utils/helper-function.util";
import { DTO_DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import {
  ClassType,
  DeepReadonly,
  DtoPropertyArgs,
  IArrayDecoratorArgs,
  IBooleanDecoratorArgs,
  IEnumDecoratorArgs,
  INumberDecoratorArgs,
  IObjectDecoratorArgs,
  IStringDecoratorArgs,
  ISwaggerSchema,
  SwaggerArrayItemType,
} from "../interfaces";

/**
 * Get name of the array item type
 * @param itemType - Array item
 * @returns name string
 */
const getItemName = (itemType: SwaggerArrayItemType): string => {
  if (typeof itemType !== "function") {
    return itemType;
  }
  return itemType.name;
};

/**
 * Add DTO class dependencies to metadata to later add it to swagger schema
 * @param target - DTO class
 * @param dtoPropertyMetadata - DTO property data
 * @param objectType - DTO property type
 */
const addDtoDependencyToMetadata = (
  target: ClassType,
  { type, options }: DeepReadonly<DtoPropertyArgs>,
  objectType: unknown,
): void => {
  if (
    (type === "array" && typeof options.itemType === "function") ||
    type === "object"
  ) {
    const existingDependencies =
      Reflect.getMetadata(
        DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
        target,
      ) ?? [];

    Reflect.defineMetadata(
      DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
      [
        ...existingDependencies,
        {
          type: type === "array"
            ? options.itemType
            : objectType,
          isEnum: type === "array"
            ? options.isItemEnum
            : false,
        },
      ],
      target,
    );
  }
};

/**
 * Add DTO property to swagger schema reflect metadata
 * @param dtoPropertyMetadata - DTO property data
 * @returns Typescript property decorator
 */
const addPropertyToSwaggerSchema = ({
  options,
  type,
}: DeepReadonly<DtoPropertyArgs>): PropertyDecorator => {
  return (target: ClassType, property: string) => {
    const exsitingSwaggerSchema: ISwaggerSchema | undefined =
      Reflect.getMetadata(DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA, target);

    const objectType = Reflect.getMetadata("design:type", target, property);

    // We want to deep copy the schema object and after then assign to reflect metadata
    // This will make sure that base classes with child extends don't get properties of child class
    // P.S. - Don't remove the deep copy unless you know what you're doing.
    // Reference issue - https://github.com/rbuckton/reflect-metadata/issues/62
    const swaggerSchema: ISwaggerSchema = deepCopyObject(
      exsitingSwaggerSchema ?? {
        type: "object",
      },
    );

    swaggerSchema.properties = swaggerSchema.properties ?? {};
    swaggerSchema.properties[property] = {
      type,
      $ref:
        type === "object"
          ? `#/components/schemas/${objectType.name}`
          : undefined,
      enum: type === "string"
        ? options.enumValues
        : undefined,
      deprecated: options.deprecated,
      nullable: options.nullable,
      items:
        type === "array"
          ? {
            $ref: `#/components/schemas/${getItemName(options.itemType)}`,
          }
          : undefined,
      maxLength: type === "string"
        ? options.maxLength
        : undefined,
      minLength: type === "string"
        ? options.minLength
        : undefined,
      minItems: type === "array"
        ? options.minItems
        : undefined,
      maxItems: type === "array"
        ? options.maxItems
        : undefined,
      maximum: type === "number"
        ? options.maximum
        : undefined,
      minimum: type === "number"
        ? options.minimum
        : undefined,
      required: options.required,
    };
    Reflect.defineMetadata(
      DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA,
      swaggerSchema,
      target,
    );

    addDtoDependencyToMetadata(
      target,
      { type, options } as DtoPropertyArgs,
      objectType,
    );
  };
};

/**
 * Marks DTO class property as array
 * @param type - Type of array
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsArray = (
  type: SwaggerArrayItemType,
  options: Readonly<Omit<IArrayDecoratorArgs["options"], "itemType">> = {},
): PropertyDecorator => {
  return addPropertyToSwaggerSchema({
    type: "array",
    options: {
      ...options,
      itemType: type,
    },
  });
};

/**
 * Marks DTO class property as boolean
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsBoolean = (
  options: Readonly<IBooleanDecoratorArgs["options"]> = {},
): PropertyDecorator => {
  return addPropertyToSwaggerSchema({ type: "boolean", options });
};

/**
 * Marks DTO class property as number
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsNumber = (
  options: Readonly<INumberDecoratorArgs["options"]> = {},
): PropertyDecorator => {
  return addPropertyToSwaggerSchema({ type: "number", options });
};

/**
 * Marks DTO class property as object or object of another class
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsObject = (
  options: Readonly<IObjectDecoratorArgs["options"]> = {},
): PropertyDecorator => {
  return addPropertyToSwaggerSchema({
    type: "object",
    options: {
      ...options,
    },
  });
};

/**
 * Marks DTO class property as string
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsString = (
  options: Readonly<Omit<IStringDecoratorArgs["options"], "enumValues">> = {},
): PropertyDecorator => {
  return addPropertyToSwaggerSchema({ type: "string", options });
};

/**
 * Marks DTO class property as enum
 * @param enumType - Enum instance
 * @param options - Optional options
 * @returns Typescript property decorator
 */
export const IsEnum = (
  enumType: any,
  options: Readonly<Omit<IEnumDecoratorArgs["options"], "enumValues">> = {},
): PropertyDecorator => {
  let enumValues = [];
  if (typeof enumType === "object") {
    enumValues = Object.values(enumType);
  }
  return addPropertyToSwaggerSchema({
    type: "string",
    options: { enumValues, ...options },
  });
};

import { SWAGGER_METADATA_DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";

/**
 * Swagger route metadata mapping object
 * Mapping for tags, description, deprecated, summary, etc
 */
export const swaggerMetadataMapping = {
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.TAG]: "tags",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SUMMARY]: "summary",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DESCRIPTION]: "description",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.EXTERNAL_DOCS]: "externalDocs",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.DEPRECATED]: "deprecated",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SECURITY]: "security",
  [SWAGGER_METADATA_DECORATOR_METADATA_ENUM.SERVERS]: "servers",
};

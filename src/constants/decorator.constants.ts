export const enum DTO_DECORATOR_METADATA_ENUM {
  DTO_SCHEMA = "__swagger-docs.dto-decorator.dto_schema__",
  DTO_SCHEMA_DEPENDENCY = "__swagger-docs.dto-decorator.dto_schema_dependency__",
}

export const enum PATH_DECORATOR_METADATA_ENUM {
  TAG = "__swagger-docs.path-decorator.tag__",
  SUMMARY = "__swagger-docs.path-decorator.summary__",
  DESCRIPTION = "__swagger-docs.path-decorator.description__",
  EXTERNAL_DOCS = "__swagger-docs.path-decorator.external_docs__",
  DEPRECATED = "__swagger-docs.path-decorator.deprecated__",
  SECURITY = "__swagger-docs.path-decorator.security__",
  SERVERS = "__swagger-docs.path-decorator.servers__",
}

export const enum DECORATOR_METADATA_ENUM {
  CONTROLLER = "__swagger-docs.decorator.controller__",

  ROUTE_HANDLER_METADATA = "__swagger-docs.decorator.route.metadata__",
  ROUTE_HANDLER_ARGS = "__swagger-docs.decorator.route.args__",

  PATH_PARAM = "__swagger-docs.decorator.route.path.param__",
  QUERY_PARAM = "__swagger-docs.decorator.route.query.param__",
  BODY = "__swagger-docs.decorator.route.body__",
  REQUEST = "__swagger-docs.decorator.route.request__",
  RESPONSE = "__swagger-docs.decorator.route.response__",
  NEXT = "__swagger-docs.decorator.route.next__",
  FILE = "__swagger-docs.decorator.route.file__",
  FILES = "__swagger-docs.decorator.route.files__",
  HEADER = "__swagger-docs.decorator.route.header__",
}

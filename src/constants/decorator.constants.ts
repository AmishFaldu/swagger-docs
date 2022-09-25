export const enum DTO_DECORATOR_METADATA_ENUM {
  DTO_SCHEMA = "__swagger_docs.dto_decorator.dto_schema__",
  DTO_SCHEMA_DEPENDENCY = "__swagger_docs.dto_decorator.dto_schema_dependency__",
}

export const enum SWAGGER_METADATA_DECORATOR_METADATA_ENUM {
  TAG = "__swagger_docs.swagger_metadata_decorator.tag__",
  SUMMARY = "__swagger_docs.swagger_metadata_decorator.summary__",
  DESCRIPTION = "__swagger_docs.swagger_metadata_decorator.description__",
  EXTERNAL_DOCS = "__swagger_docs.swagger_metadata_decorator.external_docs__",
  DEPRECATED = "__swagger_docs.swagger_metadata_decorator.deprecated__",
  SECURITY = "__swagger_docs.swagger_metadata_decorator.security__",
  SERVERS = "__swagger_docs.swagger_metadata_decorator.servers__",
  ROUTE_METADATA = "__swagger_docs.swagger_metadata_decorator.route_metadata__",
}

export const enum ROUTE_DECORATOR_METADATA_ENUM {
  RESPONSE_BODY = "__swagger_docs.route_decorator.response_body__",
  REQUEST_BODY = "__swagger_docs.route_decorator.request_body__",
  MIDDLEWARE = "__swagger_docs.route_decorator.middleware__",
}

export const enum DECORATOR_METADATA_ENUM {
  CONTROLLER = "__swagger_docs.decorator.controller__",

  ROUTE_HANDLER_METADATA = "__swagger_docs.decorator.route.metadata__",
  ROUTE_HANDLER_ARGS = "__swagger_docs.decorator.route.args__",

  PATH_PARAM = "__swagger_docs.decorator.route.path.param__",
  QUERY_PARAM = "__swagger_docs.decorator.route.query.param__",
  BODY = "__swagger_docs.decorator.route.body__",
  REQUEST = "__swagger_docs.decorator.route.request__",
  RESPONSE = "__swagger_docs.decorator.route.response__",
  NEXT = "__swagger_docs.decorator.route.next__",
  FILE = "__swagger_docs.decorator.route.file__",
  FILES = "__swagger_docs.decorator.route.files__",
  HEADER = "__swagger_docs.decorator.route.header__",
}

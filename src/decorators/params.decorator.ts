import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";

const paramDecorator = (type: string, data: Record<string, unknown> = {}) => {
  return (target: Object, key: string, index: number) => {
    const returnTypes = Reflect.getMetadata('design:paramtypes', target, key);
    const args =
      Reflect.getMetadata(DECORATOR_METADATA_ENUM.ROUTE_ARGS, target, key) ||
      {};
    Reflect.defineMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_ARGS,
      Object.assign(args, {
        [index]: { type, data, returntype: returnTypes[index].name },
      }),

      target,
      key
    );
  };
};

export const PathParam = (paramname: string) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.PATH_PARAM, { paramname });
};

export const QueryParam = (paramname: string) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.QUERY_PARAM, { paramname });
};

export const Body = () => {
  return paramDecorator(DECORATOR_METADATA_ENUM.BODY);
};

export const Request = () => {
  return paramDecorator(DECORATOR_METADATA_ENUM.REQUEST);
};

export const Response = () => {
  return paramDecorator(DECORATOR_METADATA_ENUM.RESPONSE);
};

export const Next = () => {
  return paramDecorator(DECORATOR_METADATA_ENUM.NEXT);
};

export const File = (fieldname: string) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.FILE, { fieldname });
};

export const Files = (fieldname: string) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.FILES, { fieldname });
};

export const Header = (propname: string) => {
  return paramDecorator(DECORATOR_METADATA_ENUM.HEADER, { propname });
};

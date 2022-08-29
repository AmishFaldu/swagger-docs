import { ISwaggerContact } from "./swagger-contact.interface";
import { ISwaggerLicense } from "./swagger-license.interface";

export interface ISwaggerInfo {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ISwaggerContact;
  license?: ISwaggerLicense;
  version: string;
}

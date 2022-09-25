import {
  SwaggerSecurityHttpAuthSchemesType,
  SwaggerSecuritySchemeInType,
  SwaggerSecurityType,
} from "../types";
import { ISwaggerOauthFlows } from "./swagger-oauth-flows.interface";

export interface ISwaggerSecurityScheme {
  type: SwaggerSecurityType;
  description?: string;
  name: string;
  in: SwaggerSecuritySchemeInType;
  scheme: SwaggerSecurityHttpAuthSchemesType;
  bearerFormat?: string;
  flows?: ISwaggerOauthFlows;
  openIdConnectUrl?: string;
}

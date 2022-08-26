import { ISwaggerOauthFlows } from "./swagger-oauth-flows.interface";
import { SwaggerSecuritySchemeInType } from "./types/swagger-in.type";
import { SwaggerSecurityHttpAuthSchemesType } from "./types/swagger-security-http-auth-schemes.type";
import { SwaggerSecurityType } from "./types/swagger-security.type";

export interface ISwaggerSecurityScheme {
  type: SwaggerSecurityType;
  description?: string;
  name: string;
  in: SwaggerSecuritySchemeInType;
  scheme: SwaggerSecurityHttpAuthSchemesType;
  bearerFormat?: string;
  flows: ISwaggerOauthFlows;
  openIdCOnnectUrl: string;
}

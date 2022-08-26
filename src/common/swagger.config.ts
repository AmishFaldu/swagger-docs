import { ISwaggerContact } from "src/interfaces/swagger-contact.interface";
import { ISwaggerExternalDocs } from "src/interfaces/swagger-external-docs.interface";
import { ISwaggerLicense } from "src/interfaces/swagger-license.interface";
import { ISwaggerSecurityScheme } from "src/interfaces/swagger-security-scheme.interface";
import { ISwaggerConfig } from "../interfaces/swagger-config.interface";

export class SwaggerConfig {
  private swaggerJSONConfig: ISwaggerConfig;
  constructor() {
    this.swaggerJSONConfig = {
      openapi: "3.0.0",
      info: {
        title: "Swagger Api Doc",
        version: "1.0.0",
      },
      paths: {},
      components: {},
      security: [],
      tags: [],
    };
  }

  /**
   *
   * @param title
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setTitle(title: string) {
    this.swaggerJSONConfig.info.title = title;
    return this;
  }

  /**
   *
   * @param description
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setDescription(description: string) {
    this.swaggerJSONConfig.info.description = description;
    return this;
  }

  /**
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public termsOfService(tosUrl: string) {
    this.swaggerJSONConfig.info.termsOfService = tosUrl;
    return this;
  }

  /**
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setVersion(version: string) {
    this.swaggerJSONConfig.info.version = version;
    return this;
  }

  /**
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#contactObject
   */
  public addContactInfo(data: ISwaggerContact) {
    this.swaggerJSONConfig.info.contact = data;
    return this;
  }

  /**
   *
   * @param data
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#licenseObject
   */
  public addLicenseInfo(data: ISwaggerLicense) {
    this.swaggerJSONConfig.info.license = data;
    return this;
  }

  /**
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#componentsSecuritySchemes
   */
  public addSecurity(securitySchemeName: string, data: ISwaggerSecurityScheme) {
    const securitySchema = { [securitySchemeName]: data };
    if (!this.swaggerJSONConfig?.components?.securitySchemes) {
      this.swaggerJSONConfig.components = {
        securitySchemes: securitySchema,
      };
    } else {
      Object.assign(
        this.swaggerJSONConfig.components.securitySchemes,
        securitySchema
      );
    }
    return this;
  }

  /**
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#securityRequirementObject
   */
  public addSecurityRequirement(
    securitySchemaName: string,
    requirements: string[]
  ) {
    const securityObject = { [securitySchemaName]: requirements };
    this.swaggerJSONConfig.security.push(securityObject);
    return this;
  }

  /**
   *
   * @param data
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#externalDocumentationObject
   */
  public addExternalDocumentation(data: ISwaggerExternalDocs) {
    this.swaggerJSONConfig.externalDocs = data;
    return this;
  }
}

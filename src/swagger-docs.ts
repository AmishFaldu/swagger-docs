import type { Express, Request, Response } from "express";
import * as fs from "fs";
import { access } from "fs/promises";
import { absolutePath } from "swagger-ui-dist";
import { favIconsString, htmlString, jsString } from "./constants";
import {
  IBuildSwaggerHtml,
  IBuildSwaggerJS,
  ISwaggerConfig,
  ISwaggerUIConfig,
} from "./interfaces";

/**
 * Generate and add swagger open documentation UI to web framework
 */
export class SwaggerDocs {
  private formattedSwaggerHtml: string;
  private formattedSwaggerJs: string;
  private swaggerUIDistAbsolutePath: string;

  constructor() {
    this.swaggerUIDistAbsolutePath = absolutePath();
  }

  /**
   * Add default values to swagger UI configuration
   * @param swaggerUIConfig - Swagger UI config object
   */
  private addDefaultsToSwaggerUIConfig(
    swaggerUIConfig: ISwaggerUIConfig
  ): void {
    swaggerUIConfig.customCss = swaggerUIConfig.customCss || "";
    swaggerUIConfig.customCssStyle = swaggerUIConfig.customCssStyle || "";
    swaggerUIConfig.customJs = swaggerUIConfig.customJs || "";
    swaggerUIConfig.customJsString = swaggerUIConfig.customJsString || "";
    swaggerUIConfig.customTitle = swaggerUIConfig.customTitle || "Swagger UI";
    swaggerUIConfig.displayRequestDuration =
      swaggerUIConfig.displayRequestDuration || false;
    swaggerUIConfig.filter = swaggerUIConfig.filter || false;
    swaggerUIConfig.tryItOutEnabled = swaggerUIConfig.tryItOutEnabled || false;
  }

  /**
   * Format URL path
   * @param path - URL route path
   * @returns Formatted URL path
   */
  private getFormattedPath(path: string): string {
    let formattedPath = path.slice(0, 1) === "/" ? path : `/${path}`;
    formattedPath =
      formattedPath.slice(-1) === "/" ? formattedPath : `${formattedPath}/`;
    return formattedPath;
  }

  /**
   * Build and format swagger HTML template code
   * @param {IBuildSwaggerHtml} buildObject - Object to build Swagger HTML
   * @returns Formatted Swagger HTML UI template code string
   */
  private buildSwaggerHtml(buildObject: IBuildSwaggerHtml): string {
    return Object.keys(buildObject).reduce(
      (pvalue, cvalue) =>
        pvalue.replaceAll(`{{${cvalue}}}`, buildObject[cvalue]),
      `${htmlString}`
    );
  }

  /**
   * Build and format swagger JS template code
   * @param {IBuildSwaggerJS} buildObject - Object to build Swagger JS
   * @returns Formatted Swagger JS template code string
   */
  private buildSwaggerJs({
    displayRequestDuration,
    filter,
    spec,
    tryItOutEnabled,
  }: IBuildSwaggerJS): string {
    let modifiedJsString = `${jsString}`;

    modifiedJsString = modifiedJsString
      .replaceAll("{{spec}}", spec)
      .replaceAll(
        "{{displayRequestDuration}}",
        displayRequestDuration ? "true" : "false"
      )
      .replaceAll("{{filter}}", filter ? "true" : "false")
      .replaceAll("{{tryItOutEnabled}}", tryItOutEnabled ? "true" : "false");
    return modifiedJsString;
  }

  /**
   * Build and format swagger fav icons template code
   * @param baseUrl - Base url string to access favicons
   * @returns Formatted Swagger Favicons template code string
   */
  private buildSwaggerFavIcons(baseUrl: string): string {
    let modifiedFavIconsString = `${favIconsString}`;
    modifiedFavIconsString = modifiedFavIconsString.replaceAll(
      "{{baseUrl}}",
      baseUrl
    );
    return modifiedFavIconsString;
  }

  /**
   * Setup Swagger routes on express app
   * @param app - Instance of express app
   * @param path - Route path for accessing swagger UI
   */
  private setupSwaggerExpress(app: Express, path: string): void {
    const formattedPath = this.getFormattedPath(path);

    app.get(formattedPath, (_req, res) => {
      return res.send(this.formattedSwaggerHtml);
    });

    app.get(
      `${formattedPath}swagger-initializer.js`,
      (_req: Request, res: Response) => {
        return res.send(this.formattedSwaggerJs);
      }
    );

    app.use(
      formattedPath + ":filePath",
      async (req: Request, res: Response) => {
        const filepath =
          this.swaggerUIDistAbsolutePath + "/" + req.params.filePath;

        try {
          await access(filepath, fs.constants.R_OK);
        } catch (error) {
          return res.status(404).send({ message: "File not accessible" });
        }

        return fs.createReadStream(filepath).pipe(res);
      }
    );
  }

  /**
   * Setup Swagger UI on web framework
   * @param app - Instance of express app
   * @param path - Route path for accessing swagger UI
   * @param {ISwaggerConfig} swaggerConfig - Swagger config object
   * @param {ISwaggerUIConfig} swaggerUIConfig - Swagger UI config object
   */
  public setup(
    app: Express,
    path: string,
    swaggerConfig: ISwaggerConfig,
    swaggerUIConfig: ISwaggerUIConfig = {}
  ): void {
    const baseUrl = this.getFormattedPath(path);
    this.addDefaultsToSwaggerUIConfig(swaggerUIConfig);
    const formattedFavIconsString = this.buildSwaggerFavIcons(baseUrl);

    this.formattedSwaggerJs = this.buildSwaggerJs({
      displayRequestDuration: swaggerUIConfig.displayRequestDuration,
      filter: swaggerUIConfig.filter,
      spec: JSON.stringify(swaggerConfig),
      tryItOutEnabled: swaggerUIConfig.tryItOutEnabled,
    });

    this.formattedSwaggerHtml = this.buildSwaggerHtml({
      customTitle: swaggerUIConfig.customTitle,
      favIconsString: formattedFavIconsString,
      baseUrl,
      customCss: swaggerUIConfig.customCss,
      customCssStyle: swaggerUIConfig.customCssStyle,
      customJs: swaggerUIConfig.customJs,
      customJsString: swaggerUIConfig.customJsString,
    });

    this.setupSwaggerExpress(app, path);
  }
}

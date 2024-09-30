import { Request, Response, NextFunction } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import Logger from "../../../logger";
import Middlware from "../../middleware";
import { tenantCreate } from "./schema/tenant-schema";
import { CreateTenant } from "../../../../core/domain/usecase/tenant/create-tenant";

export class CreateTenantController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: CreateTenant
  ) {}

  // @Middlware.validateSchema(tenantCreate)
  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        const { name, redirectUriSuccess, redirectUriError } = request.body;
        const output = await this.service.execute({
          name,
          redirectUriSuccess,
          redirectUriError,
        });
        response.status(201).json({
          error: false,
          data: output,
        });
      } catch (error: any) {
        response.status(400).json({
          error: true,
          message: error.message,
        });
      }
    };
  }
  /**
   * Returns the path of the controller, which is the path that the controller
   * responds to.
   * @returns the path of the controller
   */
  getPath(): string {
    return this.path;
  }
  /**
   * Returns the HTTP method of the controller, which is the method that the
   * controller responds to.
   * @returns the HTTP method of the controller
   */
  getMethod(): HttpMethod {
    return this.method;
  }
}

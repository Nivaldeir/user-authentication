import { Request, Response } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import Logger from "../../../logger";
import Middlware from "../../middleware";
import { tenantUpdate } from "./schema/tenant-schema";
import { UpdateTenant } from "../../../../core/domain/usecase/tenant/update-tenant";

export class UpdateUpdateController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: UpdateTenant
  ) {}
  // @Middlware.validateSchema(tenantUpdate)
  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        const { id } = request.params;
        const { name } = request.body;
        const output = await this.service.execute({ id, name });
        response.status(200).send({
          message: "Sucesso",
          data: output,
        });
      } catch (error: any) {
        Logger.instance.error(`[ERROR]: ${error.message}`);
        response.status(400).send({
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

import { Request, Response, NextFunction } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import { FindUsersTenant } from "../../../../core/domain/usecase/tenant/find-users";
import Logger from "../../../logger";

export class FindUsersController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: FindUsersTenant
  ) {}
  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>,
    next: NextFunction
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        const { tenantId } = request.cookies;
        const output = await this.service.execute({
          tenantId: tenantId,
        });
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

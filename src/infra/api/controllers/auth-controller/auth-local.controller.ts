import { Request, Response, NextFunction } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import Logger from "../../../logger";
import { LocalAuth } from "../../../../core/domain/usecase/auth/local-auth";

export class AuthLocalController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: LocalAuth
  ) {}

  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        const tenantId = request.cookies.tenantId;
        const { email, password, username } = request.body;
        const output = await this.service.execute({
          email,
          password,
          tenantId,
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

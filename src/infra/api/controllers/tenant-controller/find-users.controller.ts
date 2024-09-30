import { Request, Response, NextFunction } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import { FindUsersTenant } from "../../../../core/domain/usecase/tenant/find-users";
import Logger from "../../../logger";
import Middlware from "../../middleware";
import { Token } from "../../../../core/domain/usecase/token";

export class FindUsersController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: FindUsersTenant
  ) {}
  getMiddlewares?(): Array<
    (request: Request, response: Response, next: NextFunction) => void
  > {
    return [Middlware.validateRequest];
  }

  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>,
    next: NextFunction
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        let validToken = Token.verify(request.cookies["session.token"]) as any;
        if (!validToken) throw new Error("Token invalido");
        const output = await this.service.execute({
          tenantId: validToken.tenantId,
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

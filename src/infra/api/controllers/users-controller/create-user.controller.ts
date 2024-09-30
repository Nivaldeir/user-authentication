import { Request, Response, NextFunction } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import { CreateUser } from "../../../../core/domain/usecase/user/create-user";
import Logger from "../../../logger";
import Middlware from "../../middleware";
import { userCreate } from "./schema/user-schema";

export class CreateUserController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: CreateUser
  ) {}
  
  // @Middlware.validateSchema(userCreate)
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
          username,
          tenantId
        });
        response.status(201).send({
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

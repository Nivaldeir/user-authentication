import { Request, Response } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";

export class AuthLogoutController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod
  ) {}

  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      response.clearCookie("session-token", { path: "/" });
      response.status(200).send({ error: false, message: "Logged out" });
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

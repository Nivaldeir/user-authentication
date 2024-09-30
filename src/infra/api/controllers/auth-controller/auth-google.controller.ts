import { Request, Response } from "express";
import { Controller, HttpMethod, ResponseType } from "../controller";
import Logger from "../../../logger";
import passport from "passport";

export class AuthGoogleController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod
  ) {}

  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>
  ) => Promise<void> {
    return async (request, response): Promise<void> => {
      try {
        const tenantId = request.query.tenantId;
        if (!tenantId) {
          response.status(400).send({
            error: true,
            message: "O tenantId é obrigatório.",
          });
          return;
        }

        // Armazena o tenantId na sessão para ser usado no callback
        response.cookie("tenantId", tenantId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        passport.authenticate("google", {
          scope: ["profile", "email"],
        })(request, response, (err:any) => {
          if (err) {
            return response.status(500).send({
              error: true,
              message: "Erro na autenticação com o Google",
            });
          }
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

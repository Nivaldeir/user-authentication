import { Request, Response } from "express";
import Middlware from "./middleware";
import HttpController from "./http-controller";
import { userCreate, userUpdate } from "./schema/user-schema";
import { ReturnResponse } from "../../../types/http";

export default class UserController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "post",
      url: "/user",
      callback: this.create.bind(this),
    });
    this.httpServer.on({
      method: "patch",
      url: "/user/:id",
      callback: this.update.bind(this),
    });
    this.httpServer.on({
      method: "delete",
      url: "/user/:id",
      callback: this.delete.bind(this),
    });
  }

  @Middlware.validateSchema(userCreate)
  async create(req: Request, res: Response<ReturnResponse>) {
    try {
      const { email, password, username } = req.body;
      const output = await this.factory.create().createUser.execute({
        email,
        password,
        username,
      });
      res.status(201).send({
        message: "Sucesso",

        data: output,
      });
    } catch (error: any) {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  }

  @Middlware.validateRequest()
  @Middlware.validateSchema(userUpdate)
  async update(req: Request, res: Response<ReturnResponse>) {
    try {
      const { id } = req.params;
      const { password, username } = req.body;
      const output = await this.factory.create().updateUser.execute({
        id,
        password,
        username,
      });
      res.send({
        message: "Sucesso",
        data: output,
      });
    } catch (error: any) {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  }
  @Middlware.validateRequest()
  async delete(req: Request, res: Response<ReturnResponse>) {
    try {
      const { id } = req.params;
      await this.factory.create().deleteUser.execute({
        id,
      });
      res.send({
        message: "Sucesso",
      });
    } catch (error: any) {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  }
}

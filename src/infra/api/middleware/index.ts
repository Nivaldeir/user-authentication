import { AnyZodObject, ZodError } from "zod";
import Injectable from "../../di/Injectable";
import { Token } from "../../../core/domain/usecase/token";
import { UseCasesFactory } from "../../../core/app/factory/use-case-factory";
import { Request, Response } from "express";
export default class Middlware {
  @Injectable("factory_usecases")
  static factory: UseCasesFactory;
  static validateRequest() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (
        req: any,
        res: any,
        next: any
      ) {
        const token = req.cookies["session-token"]  || req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(403).send({ error: "Token invalido" });
        }
        let validToken = Token.verify(token) as any;
        if (req.params.id && req.params.id !== validToken.id) {
          return res.status(400).send({ error: "Requisição inválida" });
        }
        if (!validToken) res.status(403).send({ error: "Token invalido" });
        originalMethod.call(this, req, res, next);
      };
    };
  }
  static validateSchema(schema: AnyZodObject) {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function (req: Request, res: Response, next: any) {
        // Garantindo que req e res estão definidos
        // if (!req || !res) {
        //   return res.status(500).json({ error: "Erro interno de validação" });
        // }
  
        // try {
        //   // Parse do schema
        //   const body = req.body || {};
        //   const query = req.query || {};
        //   const params = req.params || {};
        //   await schema.parseAsync({ body, query, params });
  
        //   return originalMethod.call(this, req, res, next);
        // } catch (error: any) {
        //   if (error instanceof ZodError) {
        //     const validationErrors = error.errors.map((err) => ({
        //       field: err.path.join("."),
        //       message: err.message,
        //     }));
        //     return res.status(400).json({
        //       message: "Erro de validação",
        //       errors: validationErrors,
        //     });
        //   }
        //   return res.status(500).json({ error: "Erro interno no middleware" });
        // }
      };
    };
  }
}

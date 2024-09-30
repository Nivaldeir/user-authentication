import { Request, Response } from "express";

export default interface IHttpServer {
  start(port: number): any;
}

export interface IHttpServerSetting {
  setConfig(app: any): void;
}
export type InputHttp = {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  callback: (
    req: Request,
    res: Response<ReturnResponse>,
    next: any
  ) => Promise<any> | void;
};

export type ReturnResponse = ResponseSuccess | ResponseError;

type ResponseSuccess = {
  message: string;
  data?: any;
};

type ResponseError = {
  error: boolean;
  message?: any;
};

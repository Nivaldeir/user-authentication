import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../../../../../swagger.json";
import { Express, Request, Response } from "express";
import redoc from "redoc-express";
import { IHttpServerSetting } from "../../../../types/http";

export class SwaggerExtension implements IHttpServerSetting {
  setConfig(app: Express) {
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    app.use("/swagger", (_: Request, res: Response) => {
      return res.sendFile(process.cwd() + "/swagger.json");
    });
    app.get("/docs/swagger.json", (req, res) => {
      res.sendFile("swagger.json", { root: "." });
    });
   
    app.use("/doc", (req: Request, res: Response) => {
      return res.sendFile(process.cwd() + "/redoc-static.html");
    });
    app.get(
      "/docs",
      redoc({
        title: "Documentação",
        specUrl: "/docs/swagger.json",
        nonce: "",
        redocOptions: {
          theme: {
            colors: {
              primary: {
                main: "#6EC5AB",
              },
            },
            typography: {
              fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
              fontSize: "15px",
              lineHeight: "1.5",
              code: {
                code: "#87E8C7",
                backgroundColor: "#4D4D4E",
              },
            },
            menu: {
              backgroundColor: "#ffffff",
            },
          },
        },
      })
    );
  }
}

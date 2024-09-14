import AuthController from "./controllers/auth-controller";
import UserController from "./controllers/user-controller";
import ExpressAdapter from "./server/express-adapter";
import { CorsExtension } from "./server/extensions/cors-extension";
import { PassportExtension } from "./server/extensions/passport-extension";
import { SessionExtension } from "./server/extensions/session-extension";
import { SwaggerExtension } from "./server/extensions/swagger-extension";

const server = new ExpressAdapter();
server.settings([
  new SessionExtension(),  
  new PassportExtension(), 
  new CorsExtension(),
  new SwaggerExtension(),
]);

server.addRoutes([new AuthController(server),new UserController(server)]);
server.listen(parseInt(process.env.PORT!));
export default server;

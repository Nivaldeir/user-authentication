import { ControllerFactory } from "./controllers/controller-factory";
import { CookiesExtension } from "./extensions/cookies-extension";
import { CorsExtension } from "./extensions/cors-extension";
import { PassportExtension } from "./extensions/passport-extension";
import { SessionExtension } from "./extensions/session-extension";
import { SwaggerExtension } from "./extensions/swagger-extension";
import ExpressAdapter from "./server/express-adapter";
const server = new ExpressAdapter();
server.settings([
  new SessionExtension(),  
  new PassportExtension(), 
  new CorsExtension(),
  new SwaggerExtension(),
  new CookiesExtension()
]);

export default server;

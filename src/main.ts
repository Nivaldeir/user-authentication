console.clear();
import Registry from "./infra/di/registry";
import server from "./infra/api/index";
import { RabbitMQAdapter } from "./infra/queue/adapter/rabbit-mq";
import Queue from "./infra/queue";
import { UseCasesFactory } from "./core/app/factory/use-case-factory";
import { RepositoryFactory } from "./core/app/factory/repository-factory";
import { ControllerFactory } from "./infra/api/controllers/controller-factory";
async function init() {
  try {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    new Queue(queue);
  } catch (error) {
  }
  const repositorys = new RepositoryFactory();
  const registry = Registry.getInstance();
  registry.provide(
    "factory_usecases",
    new UseCasesFactory(
      repositorys.userRepository(),
      repositorys.authProviderRepository(),
      repositorys.authUserProviderRepository(),
      repositorys.tenantRepository()
    )
  );
  server.addRoutes(ControllerFactory.create())
  server.start(8001);
}
init();

import { UseCasesFactory } from "../../core/app/factory/use-case-factory";
import { IQueue } from "../../types/queue";
import Injectable from "../di/Injectable";

export default class {
  @Injectable("factory_usecases")
  factory: UseCasesFactory;
  constructor(readonly queue: IQueue) {
    queue.consume("create-user", async (input: InputCreateUser) => {
      // await this.factory.create().createUser.execute({
      //   email: input.email,
      //   password: input.password,
      // });
    });
  }
}

type InputCreateUser = {
  email: string;
  password: string;
  username?: string;
};

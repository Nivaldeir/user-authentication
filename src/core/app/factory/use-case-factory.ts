import { FindOrCreate } from "../../domain/usecase/auth/find-or-create";
import { LocalAuth } from "../../domain/usecase/auth/local-auth";
import { CreateUser } from "../../domain/usecase/user/create-user";
import { DeleteUser } from "../../domain/usecase/user/delete-user";
import { FindUser } from "../../domain/usecase/user/find-user";
import { UpdateUser } from "../../domain/usecase/user/update-user";
import { IAuthProviderRepository } from "../repository/auth-provider-repository";
import { IUserAuthProviderRepository } from "../repository/user-auth-provider-repository";
import { IUserRepository } from "../repository/user-repository";

export class UseCasesFactory {
  constructor(
    private readonly userRepositoryDatabase: IUserRepository,
    private readonly authProviderRepositoryDatabase: IAuthProviderRepository,
    private readonly userAuthProviderRepositoryDatabase: IUserAuthProviderRepository
  ) {}

  create(): {
    createUser: CreateUser;
    deleteUser: DeleteUser;
    findUser: FindUser;
    updateUser: UpdateUser;
    authUserLocal: LocalAuth;
    findOrCreate: FindOrCreate;
  } {
    const createUser = new CreateUser(
      this.userRepositoryDatabase,
      this.userAuthProviderRepositoryDatabase,
      this.authProviderRepositoryDatabase
    );
    const deleteUser = new DeleteUser(this.userRepositoryDatabase);
    const findUser = new FindUser(this.userRepositoryDatabase);
    const updateUser = new UpdateUser(this.userRepositoryDatabase);

    const authUserLocal = new LocalAuth(
      this.userRepositoryDatabase,
      this.userAuthProviderRepositoryDatabase
    );
    const findOrCreate = new FindOrCreate(
      this.userRepositoryDatabase,
      this.authProviderRepositoryDatabase,
      this.userAuthProviderRepositoryDatabase,
    );
    return {
      createUser,
      deleteUser,
      findUser,
      updateUser,
      authUserLocal,
      findOrCreate
    };
  }
}

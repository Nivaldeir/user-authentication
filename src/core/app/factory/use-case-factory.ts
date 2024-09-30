import { GoogleAuth } from "../../domain/usecase/auth/google-auth";
import { LocalAuth } from "../../domain/usecase/auth/local-auth";
import { CreateTenant } from "../../domain/usecase/tenant/create-tenant";
import { DeleteTenant } from "../../domain/usecase/tenant/delete-tenant";
import { FindTenant } from "../../domain/usecase/tenant/find-tenant";
import { FindUsersTenant } from "../../domain/usecase/tenant/find-users";
import { UpdateTenant } from "../../domain/usecase/tenant/update-tenant";
import { CreateUser } from "../../domain/usecase/user/create-user";
import { DeleteUser } from "../../domain/usecase/user/delete-user";
import { FindUser } from "../../domain/usecase/user/find-user";
import { UpdateUser } from "../../domain/usecase/user/update-user";
import { IAuthProviderRepository } from "../repository/auth-provider-repository";
import { ITenantRepository } from "../repository/tenant-repository";
import { IUserAuthProviderRepository } from "../repository/user-auth-provider-repository";
import { IUserRepository } from "../repository/user-repository";

export class UseCasesFactory {
  constructor(
    private readonly userRepositoryDatabase: IUserRepository,
    private readonly authProviderRepositoryDatabase: IAuthProviderRepository,
    private readonly userAuthProviderRepositoryDatabase: IUserAuthProviderRepository,
    private readonly tenantRepositoryDatabase: ITenantRepository,
  ) {}


  create(){
    const createTenant = new CreateTenant(this.tenantRepositoryDatabase)
    const findTenant = new FindTenant(this.tenantRepositoryDatabase)
    const updateTenant = new UpdateTenant(this.tenantRepositoryDatabase)
    const deleteTenant = new DeleteTenant(this.tenantRepositoryDatabase)
    const findUsersTenant = new FindUsersTenant(this.tenantRepositoryDatabase, this.userRepositoryDatabase)
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
    const googleAuth = new GoogleAuth(
      this.userRepositoryDatabase,
      this.authProviderRepositoryDatabase,
      this.userAuthProviderRepositoryDatabase,
      this.tenantRepositoryDatabase
    );
    return {
      createTenant,
      findTenant,
      updateTenant,
      deleteTenant,
      findUsersTenant,
      
      createUser,
      deleteUser,
      findUser,
      updateUser,

      authUserLocal,
      googleAuth
    };
  }
}

import { UseCasesFactory } from "../../../core/app/factory/use-case-factory";
import Injectable from "../../di/Injectable";
import { AuthGoogleController } from "./auth-controller/auth-google.controller";
import { AuthLocalController } from "./auth-controller/auth-local.controller";
import { AuthLogoutController } from "./auth-controller/auth-logout.controller";
import { AuthGoogleCallbackController } from "./auth-controller/callbacks/google-callback.controller";
import { Controller } from "./controller";
import { CreateTenantController } from "./tenant-controller/create-tenant.controller";
import { DeleteTenantController } from "./tenant-controller/delete-tenant.controller";
import { FindTenantController } from "./tenant-controller/find-tenant.controller";
import { FindUsersController } from "./tenant-controller/find-users.controller";
import { UpdateUpdateController } from "./tenant-controller/update-tenant.controller";
import { CreateUserController } from "./users-controller/create-user.controller";
import { DeleteUserController } from "./users-controller/delete-user.controller";
import { FindUserController } from "./users-controller/find-user.controller";
import { UpdateUserController } from "./users-controller/update-controller";

export class ControllerFactory {
  @Injectable("factory_usecases")
  private static factory: UseCasesFactory;
  static create(): Controller[] {
    const usecases = this.factory.create();
    return [
      //Tenants
      new CreateTenantController("/tenant", "post", usecases.createTenant),
      new FindTenantController("/tenant/:id", "get", usecases.findTenant),
      new UpdateUpdateController("/tenant", "put", usecases.updateTenant),
      new DeleteTenantController(
        "/tenant/:id",
        "delete",
        usecases.deleteTenant
      ),
      new FindUsersController(
        "/tenant/:id/users",
        "get",
        usecases.findUsersTenant
      ),
      //Users
      new CreateUserController("/users", "post", usecases.createUser),
      new DeleteUserController("/users/:id", "delete", usecases.deleteUser),
      new FindUserController("/users/:id", "get", usecases.findUser),
      new UpdateUserController("/users/:id", "put", usecases.updateUser),
      //Auths
      new AuthLocalController("/auth", "post", usecases.authUserLocal),
      new AuthGoogleController("/auth/google", "get"),
      new AuthGoogleCallbackController(
        "/auth/google/callback",
        "get",
        usecases.googleAuth
      ),
      new AuthLogoutController("/auth/logout", "post"),
    ];
  }
}

import { User } from "../../domain/entities/user";

export interface IUserRepository {
  create(data: User): Promise<User>;
  update(data: User, tenantId:string): Promise<void>;
  delete(id: string): Promise<void>;
  findById(userId: string, tenantId: string): Promise<User>;
  findByEmailOrUsername(
    emailOrUsername: string,
    tenantId: string
  ): Promise<User | null>;
}

import { Tenant } from "../../domain/entities/tenant";
import { User } from "../../domain/entities/user";

export interface ITenantRepository {
  find(id: string): Promise<Tenant>;
  create(data: any): Promise<void>;
  update(data: any): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Tenant[]>;
  findUsers(id: string): Promise<OutputFindUsers>;
}

export type OutputFindUsers = {
  tenant: Tenant,
  users: User[]
}
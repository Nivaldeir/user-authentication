import { ITenantRepository } from "../../../app/repository/tenant-repository";
import { Tenant } from "../../entities/tenant";
export class CreateTenant {
  constructor(private readonly repository: ITenantRepository) {}
  async execute(input: Input): Promise<any> {
    const tenant = Tenant.create({ ...input });
    (tenant);
    await this.repository.create(tenant);
    return {
      name: tenant.name,
      id: tenant.id,
      createdAt: tenant.createdAt?.toISOString(),
      updated: tenant.updated?.toISOString(),
    };
  }
}

type Input = {
  name: string;
  redirectUriSuccess: string;
  redirectUriError: string;
};

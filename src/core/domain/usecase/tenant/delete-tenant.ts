import { ITenantRepository } from "../../../app/repository/tenant-repository";

export class DeleteTenant {
  constructor(private readonly repository: ITenantRepository) {}
  async execute(input: Input) {
    await this.repository.delete(input.id);
  }
}

type Input = {
  id: string;
};

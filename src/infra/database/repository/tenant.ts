import {
  ITenantRepository,
  OutputFindUsers,
} from "../../../core/app/repository/tenant-repository";
import { Tenant } from "../../../core/domain/entities/tenant";
import DatabaseConnection from "../../../types/database-connection";

export class TenantDatabase implements ITenantRepository {
  constructor(private readonly db: DatabaseConnection<Tenant>) {}
  async findUsers(id: string): Promise<OutputFindUsers> {
    const tenantResult = await this.db.query(
        `SELECT * FROM tenants WHERE id = $1`,
        [id]
    );
    if (tenantResult.length === 0) {
        throw new Error(`Tenant with ID ${id} not found`);
    }

    const tenant = new Tenant({
        id: tenantResult[0].id,
        name: tenantResult[0].name,
        createdAt: tenantResult[0].created_at,
        updated: tenantResult[0].updated_at,
        redirectUriError: tenantResult[0].redirect_url_error,
        redirectUriSuccess: tenantResult[0].redirect_url_success,
    });

    const usersResult = await this.db.query(
        `
        SELECT 
            u.id, 
            u.email, 
            u.name, 
            u.created_at, 
            u.updated_at,
            ut.admin,
            ut.is_active
        FROM users u
        INNER JOIN user_tenants ut ON u.id = ut.user_id
        WHERE ut.tenant_id = $1
        `,
        [id]
    );

    const users = usersResult.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        admin: user.admin, // adicionando admin
        isActive: user.is_active, // adicione um campo para indicar se é ativo
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    }));

    return {
        tenant,
        users,
    };
}

  async find(id: string): Promise<Tenant> {
    const result = await this.db.query(
      `
      SELECT * FROM tenants WHERE id = $1
    `,
      [id]
    );

    if (result.length === 0) {
      throw new Error(`Tenant with ID ${id} not found`);
    }

    return new Tenant({
      id: result[0].id,
      name: result[0].name,
      createdAt: result[0].created_at,
      updated: result[0].updated_at,
      redirectUriError: result[0].redirect_url_error,
      redirectUriSuccess: result[0].redirect_url_success,
    });
  }

  async create(data: Tenant): Promise<void> {
    await this.db.query(
      `INSERT INTO tenants (id, name, created_at, updated_at, redirect_url_success, redirect_url_error) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $3, $4)`,
      [data.id, data.name, data.redirectUriSuccess, data.redirectUriError]
    );
  }

  async update(data: Tenant): Promise<void> {
    await this.db.query(
      `
      UPDATE tenants
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [data.name, data.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      `
      DELETE FROM tenants WHERE id = $1
    `,
      [id]
    );
  }

  async findAll(): Promise<Tenant[]> {
    const tenants = await this.db.query(`
      SELECT * FROM tenants
    `);
    return tenants.map(
      (t: any) =>
        new Tenant({
          id: t.id,
          name: t.name,
          createdAt: t.created_at,
          updated: t.updated_at,
          redirectUriError: t[0].redirect_url_error,
          redirectUriSuccess: t[0].redirect_url_success,
        })
    );
  }
}

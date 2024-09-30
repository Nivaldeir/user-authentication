import { IUserRepository } from "../../../core/app/repository/user-repository";
import { Email } from "../../../core/domain/entities/email";
import { User } from "../../../core/domain/entities/user";
import DatabaseConnection from "../../../types/database-connection";

export class UserDatabase implements IUserRepository {
  constructor(private readonly db: DatabaseConnection<User>) {}
  async findByEmailOrUsername(
    emailOrUsername: string,
    tenantId: string
  ): Promise<User | null> {
    const query = `
    SELECT u.*, ut.admin
    FROM users u
    INNER JOIN user_tenants ut ON u.id = ut.user_id
    WHERE ut.tenant_id = $1 
      AND (u.email = $2) 
      AND u.deleted_at IS NULL
  `;

    const results = await this.db.query(query, [
      tenantId,
      emailOrUsername,
      emailOrUsername,
    ]);
    if (results.length === 0) {
      return null;
    }

    const result = results[0];
    return new User({
      id: result.id,
      email: new Email(result.email),
      name: result.name,
      admin: result.admin,
      deletedAt: result.deleted_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
  async findById(id: string, tenantId: string): Promise<User> {
    const [user] = await this.db.query(
      `
      SELECT u.*, ut.admin, ut.is_active
      FROM users u
      INNER JOIN user_tenants ut ON u.id = ut.user_id
      WHERE ut.tenant_id = $1 
        AND (u.id = $2) 
        AND u.deleted_at IS NULL
      `,
      [tenantId, id]
    );
    if (!user) {
      throw new Error("user not found");
    }
    return new User({
      id: user.id,
      email: new Email(user.email),
      name: user.name,
      admin: user.admin,
      active: user.is_active,
      deletedAt: user.deleted_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  }
  async findByEmail(email: string): Promise<User> {
    const [user] = await this.db.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );
    if (!user) {
      throw new Error("user not found");
    }
    return new User({
      deletedAt: user.deleted_at,
      email: new Email(user.email),
      id: user.id,
    });
  }

  async create(data: User): Promise<User> {
    try {
      const userValues = [data.id, data.email.value, data.name];
      await this.db.query(
        `INSERT INTO public.users (id, email, name) VALUES ($1, $2, $3)`,
        userValues
      );
      return data;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  async update(data: User, tenantId: string): Promise<void> {
    try {
      await this.db.query("BEGIN");
    
      // Atualizar o usuário
      const updateUserResult = await this.db.query(
        `
          UPDATE public.users 
          SET email = $2, 
              name = $3, 
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `,
        [data.id, data.email.value, data.name]
      );
    
      // Verificar se o usuário foi encontrado
      if (updateUserResult.rowCount === 0) {
        throw new Error("User not found");
      }
    
      // Atualizar a associação entre usuário e tenant
      const updateUserTenantResult = await this.db.query(
        `
          UPDATE public.user_tenants 
          SET admin = $3, 
              is_active = $4, 
              updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = $1 AND tenant_id = $2
        `,
        [data.id, tenantId, data.admin, data.active]
      );
    
      // Verificar se a associação foi encontrada
      if (updateUserTenantResult.rowCount === 0) {
        throw new Error("User-Tenant association not found");
      }
    
      await this.db.query("COMMIT");
    } catch (error) {
      await this.db.query("ROLLBACK");
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.query(
        "UPDATE public.users SET deleted_at = NOW() WHERE id = $1",
        [id]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findMany(): Promise<any> {
    try {
      const users = (await this.db.query("SELECT * FROM public.users")) as any;
      return users.map(
        (user: any) =>
          new User({
            deletedAt: user.deleted_at,
            email: new Email(user.email),
            id: user.id,
            name: user.name,
          })
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

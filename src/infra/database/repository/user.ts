import { IUserRepository } from "../../../core/app/repository/user-repository";
import { Email } from "../../../core/domain/entities/email";
import { User } from "../../../core/domain/entities/user";
import DatabaseConnection from "../../../types/database-connection";

export class UserDatabase implements IUserRepository {
  constructor(private readonly db: DatabaseConnection<User>) {}
  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const query = `
      SELECT * 
      FROM users 
      WHERE email = $1 OR username = $2
    `;
    const [result] = await this.db.query(query, [
      emailOrUsername,
      emailOrUsername,
    ]);
    if (!result) {
      return null;
    }
    return new User({
      id: result.id,
      email: new Email(result.email),
      username: result.username,
      name: result.name,
      deletedAt: result.deleted_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
  async findById(id: string): Promise<User> {
    const [user] = await this.db.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (!user) {
      throw new Error("user not found");
    }
    return new User({
      deletedAt: user.deleted_at,
      email: new Email(user.email),
      id: user.id,
      username: user.username,
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
      username: user.username,
    });
  }

  async create(data: User): Promise<User> {
    try {
      const userValues = [data.id, data.username, data.email.value, data.name];
      await this.db.query(
        `INSERT INTO public.users (id, username, email, name) VALUES ($1, $2, $3, $4)`,
        userValues
      );
      return data;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  async update(data: User): Promise<void> {
    try {
      await this.db.query("BEGIN");
      await this.db.query(
        `
          INSERT INTO public.users (id, username, email, name) 
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE 
          SET username = EXCLUDED.username, 
          email = EXCLUDED.email, 
          name = EXCLUDED.name, 
      `,
        [data.id, data.username, data.email.value, data.name]
      );
      await this.db.query("COMMIT");
    } catch (error) {
      await this.db.query("ROLLBACK");
      console.error("Error in create:", error);
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
            username: user.username,
          })
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

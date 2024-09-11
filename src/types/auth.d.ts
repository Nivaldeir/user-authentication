export interface IAuthStrategy {
  execute(args: any): Promise<{ token: string }>;
}

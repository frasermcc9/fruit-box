export interface MigrationBase {
  canActivate(): Promise<boolean>;

  exec(): Promise<void>;
}

export class MigrationRunner {
  constructor(private readonly migrations: MigrationBase[]) {}

  async run(): Promise<void> {
    for (const migration of this.migrations) {
      if (await migration.canActivate()) {
        await migration.exec();
      }
    }
  }
}

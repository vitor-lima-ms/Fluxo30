import { DataSource, type DataSourceOptions } from 'typeorm';

export default abstract class TypeORMDataSource {
  protected connection: DataSource;
  protected readonly dataSourceOpts: DataSourceOptions;

  constructor(dataSourceOpts: DataSourceOptions) {
    this.dataSourceOpts = {
      logger: 'advanced-console',
      logging: process.env['NODE_ENV'] === 'development',

      synchronize: false,
      ...dataSourceOpts,
    };
    this.connection = new DataSource(this.dataSourceOpts);
  }

  public async connectToDB(): Promise<void> {
    await this.connection.initialize();
  }

  public async disconnectFromDB(): Promise<void> {
    if (!this.connection.isInitialized) return;

    await this.connection.destroy();
  }

  public async runPendingMigrations(): Promise<void> {
    if (!this.connection.isInitialized) return;

    const executed = await this.connection.runMigrations();
    console.log(`[PG] Database migrations applied: ${String(executed.length)}`);
  }

  public getConnection(): DataSource {
    return this.connection;
  }
}

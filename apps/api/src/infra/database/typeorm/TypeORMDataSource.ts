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

  public getConnection(): DataSource {
    return this.connection;
  }
}

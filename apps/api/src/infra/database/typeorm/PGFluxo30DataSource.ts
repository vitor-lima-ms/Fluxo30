import { singleton } from 'tsyringe';

import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

@singleton()
export default class PGFluxo30DataSource extends TypeORMDataSource {
  constructor() {
    super({
      type: 'postgres',
      host: process.env['POSTGRES_HOST'] ?? 'localhost',
      port: Number(process.env['POSTGRES_PORT'] ?? 5432),
      username: process.env['POSTGRES_USER'] ?? '',
      password: process.env['POSTGRES_PASSWORD'] ?? '',
      database: process.env['POSTGRES_DB'] ?? '',
      ...(process.env['POSTGRES_SSL'] === 'true'
        ? { ssl: { rejectUnauthorized: true } }
        : {}),
    });
  }
}

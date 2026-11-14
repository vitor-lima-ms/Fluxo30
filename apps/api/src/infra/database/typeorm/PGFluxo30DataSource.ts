import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { singleton } from 'tsyringe';

import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

const migrationsGlob = join(
  dirname(fileURLToPath(import.meta.url)),
  'migrations',
  '*.js',
);

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
      migrations: [migrationsGlob],
      migrationsRun: false,
      ...(process.env['POSTGRES_SSL'] === 'true' ?
        { ssl: { rejectUnauthorized: true } }
      : {}),
    });
  }
}

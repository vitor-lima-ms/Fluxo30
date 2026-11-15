import { fileURLToPath } from 'node:url';
import { singleton } from 'tsyringe';
import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';
import { dirname, join } from 'node:path';

const migrationsGlob = join(
  dirname(fileURLToPath(import.meta.url)),
  'migrations',
  '*.js',
);

@singleton()
export default class PGFluxo30DataSource extends TypeORMDataSource {
  constructor() {
    super({
      database: process.env['POSTGRES_DB'] ?? '',
      host: process.env['POSTGRES_HOST'] ?? 'localhost',
      migrations: [migrationsGlob],
      migrationsRun: false,
      password: process.env['POSTGRES_PASSWORD'] ?? '',
      port: Number(process.env['POSTGRES_PORT'] ?? 5432),
      type: 'postgres',
      username: process.env['POSTGRES_USER'] ?? '',
      ...(process.env['POSTGRES_SSL'] === 'true' ?
        { ssl: { rejectUnauthorized: true } }
      : {}),
    });
  }
}

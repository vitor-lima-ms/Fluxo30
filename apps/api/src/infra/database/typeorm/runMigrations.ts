import 'reflect-metadata';
import 'dotenv/config';

import { container } from 'tsyringe';

import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';
import '#shared/index';

async function main(): Promise<void> {
  const dataSource = container.resolve<TypeORMDataSource>(
    'PGFluxo30DataSource',
  );

  try {
    await dataSource.connectToDB();
    await dataSource.runPendingMigrations();
  } finally {
    await dataSource.disconnectFromDB();
  }
}

try {
  await main();
} catch (error) {
  console.log('[PG] Database migration failed', error);
  process.exit(1);
}

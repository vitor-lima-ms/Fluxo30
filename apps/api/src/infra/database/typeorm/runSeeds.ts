import 'reflect-metadata';
import 'dotenv/config';

import { container } from 'tsyringe';

import { assertDevelopmentEnv } from '#infra/database/typeorm/seeds/assertDevelopmentEnv';
import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';
import '#shared/index';

async function main(): Promise<void> {
  assertDevelopmentEnv();

  const dataSource = container.resolve<TypeORMDataSource>(
    'PGFluxo30DataSource',
  );

  try {
    await dataSource.connectToDB();
    await dataSource.runPendingSeeds();
  } finally {
    await dataSource.disconnectFromDB();
  }
}

try {
  await main();
} catch (error) {
  console.log('[PG] Database seed failed', error);
  process.exit(1);
}

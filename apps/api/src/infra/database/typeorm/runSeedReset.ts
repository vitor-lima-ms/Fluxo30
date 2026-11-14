import 'dotenv/config';
import 'reflect-metadata';
import '#shared/index';
import { assertDevelopmentEnv } from '#infra/database/typeorm/seeds/assertDevelopmentEnv';
import { container } from 'tsyringe';
import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

async function main(): Promise<void> {
  assertDevelopmentEnv();

  const dataSource = container.resolve<TypeORMDataSource>(
    'PGFluxo30DataSource',
  );

  try {
    await dataSource.connectToDB();
    await dataSource.resetAndSeed();
  } finally {
    await dataSource.disconnectFromDB();
  }
}

try {
  await main();
} catch (error) {
  console.log('[PG] Database seed reset failed', error);
  process.exit(1);
}

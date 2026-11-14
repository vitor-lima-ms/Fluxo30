import { container } from 'tsyringe';

import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

interface IDBArray {
  enabled: boolean;
  label: string;
  token: string;
}

const databases: IDBArray[] = [
  {
    enabled: true,
    label: '[PG] Database Fluxo30 is connected',
    token: 'PGFluxo30DataSource',
  },
];

export default async function setupDB(): Promise<void> {
  const runMigrationsOnBoot = process.env['NODE_ENV'] !== 'production';

  for (const { enabled, label, token } of databases) {
    if (!enabled) continue;

    const dataSource = container.resolve<TypeORMDataSource>(token);

    try {
      await dataSource.connectToDB();
      console.log(label);
    } catch (error) {
      console.log(
        `[PG] Database connection skipped or failed (${token})`,
        error,
      );
      continue;
    }

    if (!runMigrationsOnBoot) continue;

    try {
      await dataSource.runPendingMigrations();
    } catch (error) {
      console.log(`[PG] Database migration failed (${token})`, error);
      throw error;
    }

    if (process.env['NODE_ENV'] !== 'development') continue;

    try {
      await dataSource.runPendingSeeds();
    } catch (error) {
      console.log(`[PG] Database seed failed (${token})`, error);
      throw error;
    }
  }
}

export async function teardownDB(): Promise<void> {
  let failed = false;

  for (const { enabled, token } of databases) {
    if (!enabled) continue;

    try {
      await container.resolve<TypeORMDataSource>(token).disconnectFromDB();
    } catch (error) {
      failed = true;
      console.log(`[PG] Database disconnect failed (${token})`, error);
    }
  }

  if (failed) {
    throw new Error('One or more database disconnects failed');
  }
}

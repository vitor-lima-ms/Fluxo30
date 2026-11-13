import { container } from 'tsyringe';

import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

interface IDBArray {
  enabled: boolean;
  label: string;
  token: string;
}

export default async function setupDB(): Promise<void> {
  const databases: IDBArray[] = [
    {
      enabled: true,
      label: '[PG] Database Fluxo30 is connected',
      token: 'PGFluxo30DataSource',
    },
  ];

  for (const { enabled, label, token } of databases) {
    if (!enabled) continue;

    try {
      await container.resolve<TypeORMDataSource>(token).connectToDB();
      console.log(label);
    } catch (error) {
      console.log(
        `[PG] Database connection skipped or failed (${token})`,
        error,
      );
    }
  }
}

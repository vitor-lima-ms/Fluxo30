import { container } from 'tsyringe';

import PGFluxo30DataSource from '#infra/database/typeorm/PGFluxo30DataSource';
import TypeORMDataSource from '#infra/database/typeorm/TypeORMDataSource';

container.registerSingleton<TypeORMDataSource>(
  'PGFluxo30DataSource',
  PGFluxo30DataSource,
);

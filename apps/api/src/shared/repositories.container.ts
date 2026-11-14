import { container } from 'tsyringe';

import type { IPGUserRepository } from '#app/repositories/v1/database/main/user/PGUserRepository';
import PGUserRepository from '#infra/repositories/v1/database/main/user/PGUserRepository';

container.registerSingleton<IPGUserRepository>(
  'PGUserRepository',
  PGUserRepository,
);

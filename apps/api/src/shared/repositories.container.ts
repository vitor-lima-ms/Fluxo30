import { container } from 'tsyringe';
import type { IPGHomeRepository } from '#app/repositories/v1/database/main/home/PGHomeRepository';
import type { IPGUserRepository } from '#app/repositories/v1/database/main/user/PGUserRepository';
import PGHomeRepository from '#infra/repositories/v1/database/main/home/PGHomeRepository';
import PGUserRepository from '#infra/repositories/v1/database/main/user/PGUserRepository';

container.registerSingleton<IPGHomeRepository>(
  'PGHomeRepository',
  PGHomeRepository,
);
container.registerSingleton<IPGUserRepository>(
  'PGUserRepository',
  PGUserRepository,
);

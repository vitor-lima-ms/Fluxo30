import 'dotenv/config';

import setupApp from '#infra/server/app';
import setupDB from '#infra/server/database';
import setupShutdown from '#infra/server/shutdown';
import '#shared/index';

async function main(): Promise<void> {
  setupShutdown();
  await setupDB();
  await setupApp();
}

await main();

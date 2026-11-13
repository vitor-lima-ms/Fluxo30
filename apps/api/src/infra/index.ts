import 'dotenv/config';

import setupApp from '#infra/server/app';
import setupDB from '#infra/server/database';
import '#shared/index';

async function main(): Promise<void> {
  await setupDB();
  await setupApp();
}

await main();

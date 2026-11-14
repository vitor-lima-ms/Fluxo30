import 'dotenv/config';
import '#shared/index';
import setupApp from '#infra/server/app';
import setupDB from '#infra/server/database';
import setupShutdown from '#infra/server/shutdown';

async function main(): Promise<void> {
  setupShutdown();
  await setupDB();
  await setupApp();
}

await main();

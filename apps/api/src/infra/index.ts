import 'dotenv/config';

import setupApp from '#infra/server/app';

async function main(): Promise<void> {
  await setupApp();
}

await main();

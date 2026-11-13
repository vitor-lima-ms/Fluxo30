import { teardownDB } from '#infra/server/database';

export default function setupShutdown(): void {
  let shuttingDown = false;

  const onSignal = async (): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    let exitCode = 0;

    try {
      await teardownDB();
    } catch (error) {
      console.log('[PG] Database disconnect failed', error);
      exitCode = 1;
    } finally {
      process.exit(exitCode);
    }
  };

  for (const signal of ['SIGINT', 'SIGTERM', 'SIGUSR2'] as const) {
    process.on(signal, () => {
      void onSignal();
    });
  }
}

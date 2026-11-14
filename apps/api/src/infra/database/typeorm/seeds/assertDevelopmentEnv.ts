export interface SeedUserEnv {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

function readRequiredEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function assertDevelopmentEnv(): void {
  if (process.env['NODE_ENV'] !== 'development') {
    throw new Error('[PG] Seeds are allowed only when NODE_ENV=development');
  }
}

export function readSeedUserEnv(): SeedUserEnv {
  const email = readRequiredEnv('SEED_USER_EMAIL');
  const password = readRequiredEnv('SEED_USER_PASSWORD');
  const firstName = readRequiredEnv('SEED_USER_FIRST_NAME');
  const lastName = readRequiredEnv('SEED_USER_LAST_NAME');
  const missing: string[] = [];

  if (email === undefined) missing.push('SEED_USER_EMAIL');
  if (password === undefined) missing.push('SEED_USER_PASSWORD');
  if (firstName === undefined) missing.push('SEED_USER_FIRST_NAME');
  if (lastName === undefined) missing.push('SEED_USER_LAST_NAME');

  if (
    missing.length > 0
    || email === undefined
    || password === undefined
    || firstName === undefined
    || lastName === undefined
  ) {
    throw new Error(`[PG] Seed user env is incomplete: ${missing.join(', ')}`);
  }

  return { email, firstName, lastName, password };
}

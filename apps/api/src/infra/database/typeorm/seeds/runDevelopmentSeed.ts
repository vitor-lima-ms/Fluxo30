import type { DataSource, QueryRunner } from 'typeorm';
import { hash as hashPassword } from 'bcrypt';

import {
  assertDevelopmentEnv,
  readSeedUserEnv,
  type SeedUserEnv,
} from '#infra/database/typeorm/seeds/assertDevelopmentEnv';
import {
  buildLedgerRows,
  DEVELOPMENT_SEED_NAME,
  EXPENSE_SEED_COUNT,
  GLOBAL_CATEGORY_SEEDS,
  REVENUE_SEED_COUNT,
  USER_CATEGORY_SEEDS,
  type CategorySeed,
  type ResolvedCategory,
} from '#infra/database/typeorm/seeds/developmentCatalog';

const LEDGER_INSERT_BATCH_SIZE = 100;

interface InsertedRow {
  id: string;
}

function readSaltRounds(): number {
  const saltRounds = Number(process.env['SALT_ROUNDS'] ?? 10);
  if (!Number.isInteger(saltRounds) || saltRounds < 1) {
    throw new Error('[PG] SALT_ROUNDS must be a positive integer');
  }

  return saltRounds;
}

async function ensureSeedsTable(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "typeorm_seeds" (
      "id" uuid PRIMARY KEY DEFAULT uuidv7(),
      "name" varchar(255) NOT NULL UNIQUE,
      "executed_at" timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function isSeedApplied(queryRunner: QueryRunner): Promise<boolean> {
  const rows = (await queryRunner.query(
    'SELECT 1 AS present FROM "typeorm_seeds" WHERE "name" = $1 LIMIT 1',
    [DEVELOPMENT_SEED_NAME],
  )) as Array<{ present: number }>;

  return rows.length > 0;
}

async function markSeedApplied(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query('INSERT INTO "typeorm_seeds" ("name") VALUES ($1)', [
    DEVELOPMENT_SEED_NAME,
  ]);
}

async function insertCategories(
  queryRunner: QueryRunner,
  table: 'global_scoped_categories' | 'user_scoped_categories',
  categories: CategorySeed[],
  userId?: string,
): Promise<ResolvedCategory[]> {
  const scope = table === 'global_scoped_categories' ? 'global' : 'user';
  const resolved: ResolvedCategory[] = [];

  if (table === 'user_scoped_categories' && userId === undefined) {
    throw new Error('[PG] Seed user id is required for user-scoped categories');
  }

  for (const category of categories) {
    const params =
      table === 'user_scoped_categories' ?
        [userId, category.kind, category.name, category.color, category.icon]
      : [category.kind, category.name, category.color, category.icon];

    const sql =
      table === 'user_scoped_categories' ?
        `INSERT INTO "user_scoped_categories"
          ("user_id", "kind", "name", "color", "icon")
         VALUES ($1, $2, $3, $4, $5)
         RETURNING "id"`
      : `INSERT INTO "global_scoped_categories"
          ("kind", "name", "color", "icon")
         VALUES ($1, $2, $3, $4)
         RETURNING "id"`;

    const rows = (await queryRunner.query(sql, params)) as InsertedRow[];
    const id = rows[0]?.id;
    if (!id) {
      throw new Error(`[PG] Failed to insert seed category ${category.name}`);
    }

    resolved.push({ id, kind: category.kind, name: category.name, scope });
  }

  return resolved;
}

async function insertLedgerRows(
  queryRunner: QueryRunner,
  table: 'expenses' | 'revenues',
  userId: string,
  rows: ReturnType<typeof buildLedgerRows>,
): Promise<void> {
  for (
    let offset = 0;
    offset < rows.length;
    offset += LEDGER_INSERT_BATCH_SIZE
  ) {
    const batch = rows.slice(offset, offset + LEDGER_INSERT_BATCH_SIZE);
    const params: unknown[] = [];
    const values = batch.map((row, index) => {
      const base = index * 6;
      params.push(
        userId,
        row.globalScopedCategoryId,
        row.userScopedCategoryId,
        row.amount,
        row.occurredOn,
        row.description,
      );

      return `($${String(base + 1)}, $${String(base + 2)}, $${String(base + 3)}, $${String(base + 4)}, $${String(base + 5)}, $${String(base + 6)})`;
    });

    await queryRunner.query(
      `INSERT INTO "${table}"
        ("user_id", "global_scoped_category_id", "user_scoped_category_id", "amount", "occurred_on", "description")
       VALUES ${values.join(', ')}`,
      params,
    );
  }
}

async function insertDevelopmentCatalog(
  queryRunner: QueryRunner,
  seedUser: SeedUserEnv,
): Promise<void> {
  const passwordHash = await hashPassword(seedUser.password, readSaltRounds());

  const userRows = (await queryRunner.query(
    `INSERT INTO "users"
      ("first_name", "last_name", "email", "password_hash", "email_verified_at")
     VALUES ($1, $2, $3, $4, now())
     RETURNING "id"`,
    [seedUser.firstName, seedUser.lastName, seedUser.email, passwordHash],
  )) as InsertedRow[];

  const userId = userRows[0]?.id;
  if (!userId) {
    throw new Error('[PG] Failed to insert seed user');
  }

  const globalCategories = await insertCategories(
    queryRunner,
    'global_scoped_categories',
    GLOBAL_CATEGORY_SEEDS,
  );
  const userCategories = await insertCategories(
    queryRunner,
    'user_scoped_categories',
    USER_CATEGORY_SEEDS,
    userId,
  );
  const categories = [...globalCategories, ...userCategories];

  await insertLedgerRows(
    queryRunner,
    'expenses',
    userId,
    buildLedgerRows('expense', EXPENSE_SEED_COUNT, categories),
  );
  await insertLedgerRows(
    queryRunner,
    'revenues',
    userId,
    buildLedgerRows('revenue', REVENUE_SEED_COUNT, categories),
  );
}

async function applyDevelopmentCatalog(
  queryRunner: QueryRunner,
  seedUser: SeedUserEnv,
): Promise<void> {
  await queryRunner.startTransaction();
  try {
    await insertDevelopmentCatalog(queryRunner, seedUser);
    await markSeedApplied(queryRunner);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }
}

export async function runPendingDevelopmentSeed(
  connection: DataSource,
): Promise<number> {
  assertDevelopmentEnv();

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  try {
    await ensureSeedsTable(queryRunner);

    if (await isSeedApplied(queryRunner)) {
      return 0;
    }

    await applyDevelopmentCatalog(queryRunner, readSeedUserEnv());
    return 1;
  } finally {
    await queryRunner.release();
  }
}

export async function resetAndRunDevelopmentSeed(
  connection: DataSource,
): Promise<void> {
  assertDevelopmentEnv();
  const seedUser = readSeedUserEnv();

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  try {
    await ensureSeedsTable(queryRunner);
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
        TRUNCATE TABLE
          "expenses",
          "revenues",
          "user_scoped_categories",
          "global_scoped_categories",
          "users"
        RESTART IDENTITY CASCADE
      `);
      await queryRunner.query('DELETE FROM "typeorm_seeds"');
      await insertDevelopmentCatalog(queryRunner, seedUser);
      await markSeedApplied(queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  } finally {
    await queryRunner.release();
  }
}

import { Table, type MigrationInterface, type QueryRunner } from 'typeorm';

function createLedgerTable(name: 'expenses' | 'revenues'): Table {
  return new Table({
    name,
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isNullable: false,
        default: 'uuidv7()',
      },
      { name: 'user_id', type: 'uuid', isNullable: false },
      { name: 'global_scoped_category_id', type: 'uuid', isNullable: true },
      { name: 'user_scoped_category_id', type: 'uuid', isNullable: true },
      {
        name: 'amount',
        type: 'numeric',
        precision: 14,
        scale: 2,
        isNullable: false,
      },
      { name: 'occurred_on', type: 'date', isNullable: false },
      { name: 'description', type: 'varchar', length: '255', isNullable: true },
      {
        name: 'created_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
      { name: 'deleted_at', type: 'timestamptz', isNullable: true },
    ],
    checks: [
      { name: `${name}_amount_positive_check`, expression: '"amount" > 0' },
      {
        name: `${name}_category_xor_check`,
        expression:
          'num_nonnulls("global_scoped_category_id", "user_scoped_category_id") = 1',
      },
    ],
    foreignKeys: [
      {
        name: `${name}_user_id_fk`,
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      },
      {
        name: `${name}_global_scoped_category_id_fk`,
        columnNames: ['global_scoped_category_id'],
        referencedTableName: 'global_scoped_categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      },
      {
        name: `${name}_user_user_scoped_category_fk`,
        columnNames: ['user_id', 'user_scoped_category_id'],
        referencedTableName: 'user_scoped_categories',
        referencedColumnNames: ['user_id', 'id'],
        onDelete: 'RESTRICT',
      },
    ],
    indices: [
      {
        name: `${name}_user_id_occurred_on_idx`,
        columnNames: ['user_id', 'occurred_on'],
      },
      {
        name: `${name}_global_scoped_category_id_idx`,
        columnNames: ['global_scoped_category_id'],
      },
      {
        name: `${name}_user_scoped_category_id_idx`,
        columnNames: ['user_scoped_category_id'],
      },
    ],
  });
}

export class CreateCategoriesExpensesRevenues1794623727856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'global_scoped_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuidv7()',
          },
          { name: 'kind', type: 'varchar', length: '20', isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'color', type: 'varchar', length: '7', isNullable: false },
          { name: 'icon', type: 'varchar', length: '50', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
        checks: [
          {
            name: 'global_scoped_categories_kind_check',
            expression: `"kind" IN ('expense', 'revenue')`,
          },
          {
            name: 'global_scoped_categories_color_check',
            expression: `"color" ~ '^#[0-9A-Fa-f]{6}$'`,
          },
        ],
      }),
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX "global_scoped_categories_kind_name_active_unique" ON "global_scoped_categories" ("kind", lower("name")) WHERE "deleted_at" IS NULL',
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_scoped_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuidv7()',
          },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'kind', type: 'varchar', length: '20', isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'color', type: 'varchar', length: '7', isNullable: false },
          { name: 'icon', type: 'varchar', length: '50', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
        checks: [
          {
            name: 'user_scoped_categories_kind_check',
            expression: `"kind" IN ('expense', 'revenue')`,
          },
          {
            name: 'user_scoped_categories_color_check',
            expression: `"color" ~ '^#[0-9A-Fa-f]{6}$'`,
          },
        ],
        uniques: [
          {
            name: 'user_scoped_categories_id_user_id_unique',
            columnNames: ['id', 'user_id'],
          },
        ],
        indices: [
          {
            name: 'user_scoped_categories_user_id_idx',
            columnNames: ['user_id'],
          },
        ],
        foreignKeys: [
          {
            name: 'user_scoped_categories_user_id_fk',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX "user_scoped_categories_user_kind_name_active_unique" ON "user_scoped_categories" ("user_id", "kind", lower("name")) WHERE "deleted_at" IS NULL',
    );

    await queryRunner.createTable(createLedgerTable('expenses'));
    await queryRunner.createTable(createLedgerTable('revenues'));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('revenues');
    await queryRunner.dropTable('expenses');
    await queryRunner.dropIndex(
      'user_scoped_categories',
      'user_scoped_categories_user_kind_name_active_unique',
    );
    await queryRunner.dropTable('user_scoped_categories');
    await queryRunner.dropIndex(
      'global_scoped_categories',
      'global_scoped_categories_kind_name_active_unique',
    );
    await queryRunner.dropTable('global_scoped_categories');
  }
}

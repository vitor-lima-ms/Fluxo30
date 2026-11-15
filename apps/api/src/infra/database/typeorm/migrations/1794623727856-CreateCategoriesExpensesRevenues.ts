import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

function createLedgerTable(name: 'expenses' | 'revenues'): Table {
  return new Table({
    checks: [
      { expression: '"amount" > 0', name: `${name}_amount_positive_check` },
      {
        expression:
          'num_nonnulls("global_scoped_category_id", "user_scoped_category_id") = 1',
        name: `${name}_category_xor_check`,
      },
    ],
    columns: [
      {
        default: 'uuidv7()',
        isNullable: false,
        isPrimary: true,
        name: 'id',
        type: 'uuid',
      },
      { isNullable: false, name: 'user_id', type: 'uuid' },
      { isNullable: true, name: 'global_scoped_category_id', type: 'uuid' },
      { isNullable: true, name: 'user_scoped_category_id', type: 'uuid' },
      {
        isNullable: false,
        name: 'amount',
        precision: 14,
        scale: 2,
        type: 'numeric',
      },
      { isNullable: false, name: 'occurred_on', type: 'date' },
      { isNullable: true, length: '255', name: 'description', type: 'varchar' },
      {
        default: 'now()',
        isNullable: false,
        name: 'created_at',
        type: 'timestamptz',
      },
      {
        default: 'now()',
        isNullable: false,
        name: 'updated_at',
        type: 'timestamptz',
      },
      { isNullable: true, name: 'deleted_at', type: 'timestamptz' },
    ],
    foreignKeys: [
      {
        columnNames: ['user_id'],
        name: `${name}_user_id_fk`,
        onDelete: 'RESTRICT',
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      },
      {
        columnNames: ['global_scoped_category_id'],
        name: `${name}_global_scoped_category_id_fk`,
        onDelete: 'RESTRICT',
        referencedColumnNames: ['id'],
        referencedTableName: 'global_scoped_categories',
      },
      {
        columnNames: ['user_id', 'user_scoped_category_id'],
        name: `${name}_user_user_scoped_category_fk`,
        onDelete: 'RESTRICT',
        referencedColumnNames: ['user_id', 'id'],
        referencedTableName: 'user_scoped_categories',
      },
    ],
    indices: [
      {
        columnNames: ['user_id', 'occurred_on'],
        name: `${name}_user_id_occurred_on_idx`,
      },
      {
        columnNames: ['global_scoped_category_id'],
        name: `${name}_global_scoped_category_id_idx`,
      },
      {
        columnNames: ['user_scoped_category_id'],
        name: `${name}_user_scoped_category_id_idx`,
      },
    ],
    name,
  });
}

export class CreateCategoriesExpensesRevenues1794623727856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        checks: [
          {
            expression: `"kind" IN ('expense', 'revenue')`,
            name: 'global_scoped_categories_kind_check',
          },
          {
            expression: `"color" ~ '^#[0-9A-Fa-f]{6}$'`,
            name: 'global_scoped_categories_color_check',
          },
        ],
        columns: [
          {
            default: 'uuidv7()',
            isNullable: false,
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          { isNullable: false, length: '20', name: 'kind', type: 'varchar' },
          { isNullable: false, length: '100', name: 'name', type: 'varchar' },
          { isNullable: false, length: '7', name: 'color', type: 'varchar' },
          { isNullable: false, length: '50', name: 'icon', type: 'varchar' },
          {
            default: 'now()',
            isNullable: false,
            name: 'created_at',
            type: 'timestamptz',
          },
          {
            default: 'now()',
            isNullable: false,
            name: 'updated_at',
            type: 'timestamptz',
          },
          { isNullable: true, name: 'deleted_at', type: 'timestamptz' },
        ],
        name: 'global_scoped_categories',
      }),
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX "global_scoped_categories_kind_name_active_unique" ON "global_scoped_categories" ("kind", lower("name")) WHERE "deleted_at" IS NULL',
    );

    await queryRunner.createTable(
      new Table({
        checks: [
          {
            expression: `"kind" IN ('expense', 'revenue')`,
            name: 'user_scoped_categories_kind_check',
          },
          {
            expression: `"color" ~ '^#[0-9A-Fa-f]{6}$'`,
            name: 'user_scoped_categories_color_check',
          },
        ],
        columns: [
          {
            default: 'uuidv7()',
            isNullable: false,
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          { isNullable: false, name: 'user_id', type: 'uuid' },
          { isNullable: false, length: '20', name: 'kind', type: 'varchar' },
          { isNullable: false, length: '100', name: 'name', type: 'varchar' },
          { isNullable: false, length: '7', name: 'color', type: 'varchar' },
          { isNullable: false, length: '50', name: 'icon', type: 'varchar' },
          {
            default: 'now()',
            isNullable: false,
            name: 'created_at',
            type: 'timestamptz',
          },
          {
            default: 'now()',
            isNullable: false,
            name: 'updated_at',
            type: 'timestamptz',
          },
          { isNullable: true, name: 'deleted_at', type: 'timestamptz' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            name: 'user_scoped_categories_user_id_fk',
            onDelete: 'RESTRICT',
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          },
        ],
        indices: [
          {
            columnNames: ['user_id'],
            name: 'user_scoped_categories_user_id_idx',
          },
        ],
        name: 'user_scoped_categories',
        uniques: [
          {
            columnNames: ['id', 'user_id'],
            name: 'user_scoped_categories_id_user_id_unique',
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

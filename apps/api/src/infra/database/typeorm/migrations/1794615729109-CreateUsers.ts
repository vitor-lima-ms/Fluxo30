import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class CreateUsers1794615729109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'uuidv7()',
            isNullable: false,
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            isNullable: false,
            length: '100',
            name: 'first_name',
            type: 'varchar',
          },
          {
            isNullable: false,
            length: '100',
            name: 'last_name',
            type: 'varchar',
          },
          { isNullable: false, length: '255', name: 'email', type: 'varchar' },
          {
            isNullable: false,
            length: '255',
            name: 'password_hash',
            type: 'varchar',
          },
          { isNullable: true, name: 'email_verified_at', type: 'timestamptz' },
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
        name: 'users',
      }),
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX "users_email_active_unique" ON "users" ("email") WHERE "deleted_at" IS NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "users_email_lower_active_unique" ON "users" (lower("email")) WHERE "deleted_at" IS NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'users_email_lower_active_unique');
    await queryRunner.dropIndex('users', 'users_email_active_unique');
    await queryRunner.dropTable('users');
  }
}

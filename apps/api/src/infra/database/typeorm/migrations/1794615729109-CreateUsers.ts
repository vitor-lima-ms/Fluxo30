import { Table, type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateUsers1794615729109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuidv7()',
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'email_verified_at', type: 'timestamptz', isNullable: true },
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

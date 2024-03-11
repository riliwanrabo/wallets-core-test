import { TransactionStatusEnum } from 'src/transactions/entities/transaction.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class OutwardOnCreate1710135646630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TRIGGER insert_balance_cache AFTER INSERT ON outward_transactions
        FOR EACH ROW
        BEGIN
            IF NEW.status = '${TransactionStatusEnum.PENDING}' THEN
              UPDATE balance_cache
              SET pending_debit = pending_debit + NEW.amount
              WHERE wallet_id = NEW.wallet_id;
            END IF;
        END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS insert_balance_cache`);
  }
}

import { TransactionStatusEnum } from 'src/transactions/entities/transaction.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class OutwardOnUpdate1710135654404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TRIGGER update_balance_cache AFTER UPDATE ON outward_transactions
        FOR EACH ROW
        BEGIN
            IF NEW.status = '${TransactionStatusEnum.POSTED}' THEN
                UPDATE balance_cache
                SET available_credit = available_credit + NEW.amount, 
                    available_debit = available_debit + NEW.amount,
                    pending_debit = pending_debit - NEW.amount
                WHERE wallet_id = NEW.wallet_id;
            END IF;
        END;
    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_balance_cache`);
  }
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const WalletStatusEnum = {
  POSTED: 'posted',
  PENDING: 'pending',
};
export class DebitWalletDTO {
  status: string;
}

@Entity('balance_cache')
export class Wallets extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  wallet_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  pending_credit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  pending_debit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  available_credit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  available_debit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  rolling_credit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  rolling_debit: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, default: 0 })
  amount: number;

  @Column({ nullable: true, default: false })
  block_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Posted Credit + Pending Credits - Posted Debits + Pending Debits
  public get availableBalance() {
    // return (
    //   this.available_credit +
    //   this.pending_credit -
    //   (this.available_debit + this.pending_debit))
  }

  async debitWallet(walletRequest: DebitWalletDTO): Promise<Wallets> {
    /**
     * This block should be in a DB transaction
     * check balances
     * post debits
     * check balances
     * if balance is $gte 0 commit
     * else rollback transaction
     */

    return this.save();
  }

  async creditWallet(): Promise<Wallets> {
    /**
     * This block should be in a DB transaction
     * check balances
     * post debits
     * check balances
     * if balance is $gte 0 commit
     * else rollback transaction
     */

    return this.save();
  }

  async reconcile() {
    /**
     * Assets = Liabilities + Equity
     */
  }
}

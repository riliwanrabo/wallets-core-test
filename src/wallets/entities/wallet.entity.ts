import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
    return 0;
  }

  async postDebit(amount: number, type?: string) {
    this.pending_debit + amount;
    await this.save();
  }
}

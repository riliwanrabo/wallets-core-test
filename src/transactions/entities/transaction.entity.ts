import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionStatusEnum {
  POSTED = 'posted',
  PENDING = 'pending',
}

export class BaseTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  status: string;

  @Column()
  wallet_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  get isPosted() {
    return this.status === TransactionStatusEnum.POSTED;
  }

  get isPending() {
    return this.status === TransactionStatusEnum.PENDING;
  }
}

@Entity('inward_transactions')
export class InwardTransactions extends BaseTransaction {
  constructor() {
    super();
  }
  @AfterInsert()
  updateBalanceCache() {
    if (this.isPosted) {
    }
  }
}

@Entity('outward_transactions')
export class OutwardTransactions extends BaseTransaction {
  constructor() {
    super();
  }
}

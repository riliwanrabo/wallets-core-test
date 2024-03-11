import {
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

  // @Column({ unique: true })
  // reference: string;

  // @Column({ unique: true, nullable: true })
  // external_reference: string;

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
}

@Entity('inward_transactions')
export class InwardTransaction extends BaseTransaction {
  constructor() {
    super();
  }
}

@Entity('outward_transactions')
export class OutwardTransaction extends BaseTransaction {
  constructor() {
    super();
  }
}

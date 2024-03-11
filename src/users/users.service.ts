import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallets } from 'src/wallets/entities/wallet.entity';
import {
  InwardTransactions,
  OutwardTransactions,
} from 'src/transactions/entities/transaction.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Wallets)
    private readonly walletsRepository: Repository<Wallets>,

    @InjectRepository(InwardTransactions)
    private readonly inwTransactionRepository: Repository<InwardTransactions>,

    @InjectRepository(OutwardTransactions)
    private readonly outTransactionRepository: Repository<OutwardTransactions>,

    private readonly datasource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['name'], // selecting few columns
    });
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return await this.userRepository.remove(user);
  }

  async simulateEntries(request: any) {
    const newWallet = this.walletsRepository.create(request);
    return await this.walletsRepository.save(newWallet);
  }

  async simulatePayin(request: any) {
    const newTransaction = this.inwTransactionRepository.create(request);

    (await this.walletsRepository.count()) > 0
      ? null
      : await this.walletsRepository.create().save();

    return await this.inwTransactionRepository.save(newTransaction);
  }

  async simulatePayoutB4(request: any) {
    const newTransaction = this.outTransactionRepository.create(request);

    (await this.walletsRepository.count()) > 0
      ? null
      : await this.walletsRepository.create().save();

    return await this.outTransactionRepository.save(newTransaction);
  }

  async simulatePayout(request: any) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newTransaction = queryRunner.manager.create(
        this.outTransactionRepository.target,
        request,
      );

      const count = await queryRunner.manager.count(
        this.walletsRepository.target,
      );
      if (count === 0) {
        await queryRunner.manager.save(
          this.walletsRepository.target,
          this.walletsRepository.create(request),
        );
      }
      const result = await queryRunner.manager.save(newTransaction);
      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePayout(walletId: string, request: any) {
    const transaction = await this.outTransactionRepository.findOneBy({
      wallet_id: walletId,
    });

    transaction.status = request.status;

    return await transaction.save();
  }

  async fetchBalance() {
    return 0;
  }
}

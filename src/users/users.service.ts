import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallets } from 'src/wallets/entities/wallet.entity';
import {
  InwardTransaction,
  OutwardTransaction,
} from 'src/transactions/entities/transaction.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Wallets)
    private readonly walletsRepository: Repository<Wallets>,

    @InjectRepository(InwardTransaction)
    private readonly inwTransactionRepository: Repository<InwardTransaction>,

    @InjectRepository(OutwardTransaction)
    private readonly outTransactionRepository: Repository<OutwardTransaction>,

    private readonly datasource: DataSource,

    private readonly entityManager: EntityManager,
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
    return this.datasource.manager.transaction(async (em) => {
      const newWallet = this.walletsRepository.create(request);
      // await this.walletsRepository.save(newWallet);

      em.save(newWallet);
    });
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

    // create wallet if not exists (simulation)
    this.createWallet(request, queryRunner);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    // check available balance
    const availableBalance = new Wallets().availableBalance;
    console.log(availableBalance);

    try {
      const newTransaction = queryRunner.manager.create(
        this.outTransactionRepository.target,
        request,
      );

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
  async createWallet(request, queryRunner) {
    const count = await queryRunner.manager.count(
      this.walletsRepository.target,
    );
    if (count === 0) {
      await queryRunner.manager.save(
        this.walletsRepository.target,
        this.walletsRepository.create(request),
      );
    }
  }

  async updatePayout(walletId: string, request: any) {
    const transaction = await this.outTransactionRepository.findOneBy({
      wallet_id: walletId,
    });

    transaction.status = request.status;

    // check available balance
    const availableBalance = new Wallets().availableBalance;
    console.log('new balance is: ', availableBalance);

    return await transaction.save();
  }

  async fetchBalance() {
    return 0;
  }
}

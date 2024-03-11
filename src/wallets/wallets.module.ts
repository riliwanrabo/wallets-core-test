import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallets } from './entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallets])],
})
export class WalletsModule {}

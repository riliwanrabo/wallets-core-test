import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('outward')
  simulatePayout(@Body() request: any) {
    this.usersService.simulatePayout(request);
  }

  @Patch('outward/:id')
  updatePayoutStatus(@Param('id') id: string, @Body() request: any) {
    return this.usersService.updatePayout(id, request);
  }

  @Post('entries')
  simulateEntries(@Body() request: any) {
    this.usersService.simulateEntries(request);
  }

  @Get('balance')
  fetchBalance() {
    return this.usersService.fetchBalance();
  }
}

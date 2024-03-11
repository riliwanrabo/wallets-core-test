import { Body, Controller, Post } from '@nestjs/common';

@Controller('experiment')
export class ExperimentController {
  @Post('payin')
  async simulatePayins(@Body() request: any) {}
}

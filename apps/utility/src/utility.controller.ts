import { Controller, Get } from '@nestjs/common';
import { UtilityService } from './utility.service';

@Controller()
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  @Get()
  getHello(): string {
    return this.utilityService.getHello();
  }
}

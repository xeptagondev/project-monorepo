import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  getHello(): string {
    return 'Hello World!';
  }
}

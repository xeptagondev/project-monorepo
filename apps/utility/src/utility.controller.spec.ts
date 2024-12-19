import { Test, TestingModule } from '@nestjs/testing';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';

describe('UtilityController', () => {
  let utilityController: UtilityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UtilityController],
      providers: [UtilityService],
    }).compile();

    utilityController = app.get<UtilityController>(UtilityController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(utilityController.getHello()).toBe('Hello World!');
    });
  });
});

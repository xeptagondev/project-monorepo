import { Test, TestingModule } from '@nestjs/testing';
import { DbUtilService } from './db-util.service';

describe('DbUtilService', () => {
  let service: DbUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbUtilService],
    }).compile();

    service = module.get<DbUtilService>(DbUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

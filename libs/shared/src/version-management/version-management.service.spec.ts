import { Test, TestingModule } from '@nestjs/testing';
import { VersionManagementService } from './version-management.service';

describe('VersionManagementService', () => {
  let service: VersionManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VersionManagementService],
    }).compile();

    service = module.get<VersionManagementService>(VersionManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

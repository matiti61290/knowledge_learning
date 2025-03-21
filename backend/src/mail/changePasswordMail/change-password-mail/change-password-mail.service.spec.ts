import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordMailService } from './change-password-mail.service';

describe('ChangePasswordMailService', () => {
  let service: ChangePasswordMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangePasswordMailService],
    }).compile();

    service = module.get<ChangePasswordMailService>(ChangePasswordMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

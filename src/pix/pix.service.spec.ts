import { Test, TestingModule } from '@nestjs/testing';
import { PixService } from './pix.service';
import { HttpService } from '@nestjs/axios';

describe('PixService', () => {
  let service: PixService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixService, { provide: HttpService, useValue: {} }],
    }).compile();

    service = module.get<PixService>(PixService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
});

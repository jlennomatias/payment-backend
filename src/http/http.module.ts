// src/http/http.module.ts
import { Module } from '@nestjs/common';
import { HttpService } from './http.service';

@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}

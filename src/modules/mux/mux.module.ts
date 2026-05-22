import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MuxService } from './mux.service';

@Module({
  imports: [ConfigModule],
  providers: [MuxService],
  exports: [MuxService],
})
export class MuxModule {}

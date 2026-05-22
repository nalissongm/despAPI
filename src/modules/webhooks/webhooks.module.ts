import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhooksController } from './webhooks.controller';
import { LessonsModule } from '../courses/lessons.module';

@Module({
  imports: [ConfigModule, LessonsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}

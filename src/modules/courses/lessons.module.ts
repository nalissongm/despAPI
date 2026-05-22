import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonsController } from './infra/controllers/lessons.controller';
import { LessonsService } from './usecases/lessons.service';
import { LessonModel } from './infra/models/lesson.model';
import { MuxModule } from '../mux/mux.module';

@Module({
  imports: [
    SequelizeModule.forFeature([LessonModel]),
    MuxModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}

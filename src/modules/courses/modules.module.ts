import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModulesController } from './infra/controllers/modules.controller';
import { ModulesService } from './usecases/modules.service';
import { CourseModuleModel } from './infra/models/course-module.model';

@Module({
  imports: [SequelizeModule.forFeature([CourseModuleModel])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}

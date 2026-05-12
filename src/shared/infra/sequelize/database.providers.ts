// src/shared/infra/sequelize/database.providers.ts

import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../../modules/auth/infra/models/user.model';
import { CourseModel } from '../../../modules/courses/infra/models/course.model';
import { UserCourseModel } from '../../../modules/courses/infra/models/user-course.model';
import { ContentModel } from '../../../modules/content/infra/models/content.model';
import { UserContentModel } from '../../../modules/content/infra/models/user-content.model';

export const databaseProviders: Provider[] = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_DATABASE') || 'despapi',
        logging: false, // Set to true to see SQL queries
      });

      // Add models here
      sequelize.addModels([
        UserModel,
        CourseModel,
        UserCourseModel,
        ContentModel,
        UserContentModel,
      ]);

      // Sync all models
      // In a real production app, you might want to use migrations instead.
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];

import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../../modules/auth/infra/models/user.model';
import { RoleModel } from '../../../modules/roles/infra/models/role.model';
import { UserRoleModel } from '../../../modules/roles/infra/models/user-role.model';
import { InstructorProfileModel } from '../../../modules/instructors/infra/models/instructor-profile.model';
import { CourseModel } from '../../../modules/courses/infra/models/course.model';
import { CourseModuleModel } from '../../../modules/courses/infra/models/course-module.model';
import { LessonModel } from '../../../modules/courses/infra/models/lesson.model';
import { EnrollmentModel } from '../../../modules/enrollments/infra/models/enrollment.model';
import { UserLessonProgressModel } from '../../../modules/progress/infra/models/user-lesson-progress.model';
import { FileModel } from '../../../modules/files/infra/models/file.model';
import { LessonFileModel } from '../../../modules/files/infra/models/lesson-file.model';

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
        RoleModel,
        UserRoleModel,
        InstructorProfileModel,
        CourseModel,
        CourseModuleModel,
        LessonModel,
        EnrollmentModel,
        UserLessonProgressModel,
        FileModel,
        LessonFileModel,
      ]);

      // Sync all models
      // In a real production app, you might want to use migrations instead.
      await sequelize.sync({ force: true });

      return sequelize;
    },
  },
];

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { InstructorsModule } from './modules/instructors/instructors.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { CoursesModule } from './modules/courses/courses.module';
import { FilesModule } from './modules/files/files.module';
import { ProgressModule } from './modules/progress/progress.module';
import { AppController } from './app.controller';
import { MuxModule } from './modules/mux/mux.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { JwtAuthGuard } from './modules/auth/infra/http/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'despapi',
      autoLoadModels: true,
      synchronize: true, // Be careful with this in production
      logging: false,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    InstructorsModule,
    EnrollmentsModule,
    CoursesModule,
    FilesModule,
    ProgressModule,
    MuxModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

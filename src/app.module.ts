// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { databaseProviders } from './shared/infra/sequelize/database.providers';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env variables available globally
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController], // You can add AppController if you have one
  providers: [...databaseProviders],
  exports: [...databaseProviders], // Export sequelize for other modules if needed
})
export class AppModule {}

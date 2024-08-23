import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  
  imports: [
    // Configuration module to read enviromental variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    // Sequelize ORM module for using sequelize to call PotgresSQL database
    SequelizeModule.forRoot({
      // Variables for database connection
      dialect: process.env.DIALECT_USERNAME as any,
      host: process.env.HOST,
      port: process.env.PORT as any,
      username: process.env.DIALECT_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,

      // Auto create models (tables) in the database if they are not already created
      autoLoadModels: true,
      synchronize: true
    }),

    // Auth module (which is user defined module)
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

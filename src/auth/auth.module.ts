import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user.model";
import { SequelizeModule } from "@nestjs/sequelize";

// User defined module to handle users requests such as (login , register , get user by username , ...etc) 
@Module({
    // Import nessecassry modules to be used in this module
    imports: [
        // Sequelize module which will take "User" model to create it in the database and allow this module to interact with this table
        SequelizeModule.forFeature([User]),
        // Configuration module to use enviromental variables
        ConfigModule.forRoot({envFilePath: '.env.development'}),
    ],
    
    // Controllers for taking requests 
    controllers: [AuthController],

    // Services that will handle logic inside controllers
    providers: [AuthService],
    exports: []
})
export class AuthModule{}
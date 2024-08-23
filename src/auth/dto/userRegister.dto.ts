import { IsNotEmpty, IsString } from "class-validator";

// DTO (Data Transfer Object) for register credintials
export class UserRegisterDto{

    // username must be string and can't be empty
    @IsString()
    @IsNotEmpty()
    username: string;

    // username must be string and can't be empty
    @IsString()
    @IsNotEmpty()
    password: string

    // Role attribute doesn't have any restrictions as it is made "client" by default when registering new user
    role: string;
}
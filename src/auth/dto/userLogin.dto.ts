import { IsNotEmpty, IsString } from "class-validator";

// DTO (Data Transfer Object) for login credintials
export class UserLoginDto{

    // username must be string and can't be empty
    @IsString()
    @IsNotEmpty()
    username: string;
    
    // username must be string and can't be empty
    @IsString()
    @IsNotEmpty()
    password: string
}
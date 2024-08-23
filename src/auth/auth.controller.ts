import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Res} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto/userRegister.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UserLoginDto } from "./dto/userLogin.dto";
import { Response } from "express";

// Controller for routing requests
// Base route "/api"
@Controller("/api")
export class AuthController{
    constructor(private readonly authService:AuthService){}

    // Register route
    @Post("/register")
    @HttpCode(HttpStatus.CREATED) // Send status "(201) created" as response on success
    async register(@Body() userRegisterDto:UserRegisterDto , @Res() res:Response){
        const username = await this.authService.register(userRegisterDto);
        res.send( {status: HttpStatusMessage.SUCCESS , data: {username}} );
    }

    // Login route
    @Post("/login")
    @HttpCode(HttpStatus.OK) // Send status "(200) ok" as response on success
    async login(@Body() userLoginDto:UserLoginDto , @Res() res:Response){
        const username = await this.authService.login(userLoginDto);
        res.send( {status: HttpStatusMessage.SUCCESS , data: {username}} );
    }

    // Login as admin route
    @Post("/login/admin")
    @HttpCode(HttpStatus.OK) // Send status "(200) ok" as response on success
    async loginAdmin(@Body() userLoginDto:UserLoginDto , @Res() res:Response){
        const username = await this.authService.loginAdmin(userLoginDto);
        res.send( {status: HttpStatusMessage.SUCCESS , data: {username}} );
    }

    // Get all users route
    @Get("/users")
    @HttpCode(HttpStatus.OK) // Send status "(200) ok" as response on success
    async getAllUsers(@Query("limit") limit:number , @Query("page") page:number){
        const offset = limit*(page-1);
        const {rows , count} = await this.authService.getAllUsers(limit,offset);
        return ({status: HttpStatusMessage.SUCCESS , data: {users:rows , count:count}});
    }

    // Block/unblock user route
    @Patch("/users/block")
    @HttpCode(HttpStatus.OK) // Send status "(200) ok" as response on success
    async userBlockUnblock(@Query("username") username:string){
        const newUser = await this.authService.userBlockUnblock(username);
        return ({status: HttpStatusMessage.SUCCESS , data: {user:newUser} });
    }
    
    // makeAdmin/removeAdmin route
    @Patch("/users/admin")
    @HttpCode(HttpStatus.OK) // Send status "(200) ok" as response on success
    async userAdminUnadmin(@Query("username") username:string){
        const newUser = await this.authService.userAdminUnadmin(username);
        return ({status: HttpStatusMessage.SUCCESS , data: {user:newUser} });
    }

}
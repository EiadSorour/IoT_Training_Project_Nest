import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRegisterDto } from "./dto/userRegister.dto";
import * as bcrypt from 'bcrypt';
import { AppError } from "src/utils/app.Error";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UserLoginDto } from "./dto/userLogin.dto";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AuthService{

    // Inject "User" model to be used in this service (Dependency Injection)
    constructor(
        @InjectModel(User) private readonly userModel:typeof User
    ){}
    
    // Find user from "User" model using sequelize that matchs given username
    async getUserByExactUsername(username:string): Promise<User>{
        return await this.userModel.findOne( {where: {username: username}} );
    }

    // Add new user to the table
    async addUser(userRegisterDto: UserRegisterDto): Promise<User>{
        return await this.userModel.create(userRegisterDto as any);
    }
    
    // Register service
    async register(userRegisterDto: UserRegisterDto): Promise<String>{
        // Get old user
        const oldUser:User = await this.getUserByExactUsername(userRegisterDto.username);
        
        // if old user exists with same username then can't be regestered again throw error and return
        if(oldUser){
            throw new AppError("User already exists" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }
        
        // Hash password before saving it in the databse using "bcrypt" package (More secured approach)
        userRegisterDto.password = await bcrypt.hash(userRegisterDto.password , 10);

        // Assign role as "client" by default
        userRegisterDto.role = "client";

        // add user to the databsse
        const user = await this.addUser(userRegisterDto);

        // return username
        return user.username;
    }

    // Login Service
    async login(userLoginDto:UserLoginDto): Promise<String>{

        // Get user from the database
        const user:User = await this.getUserByExactUsername(userLoginDto.username);
        
        // if user doesn't exist throw error and return
        if(!user){
            throw new AppError("User doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }
        
        // comapre given password with the hashed password in the database using bcrypt 
        const correctPassword:boolean = await bcrypt.compare(userLoginDto.password , user.password);
        
        // if passwords doesn't match throw error and return
        if(!correctPassword){
            throw new AppError("Incorrect password" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }

        // if user is blocked through error and return
        if(user.isBlocked){
            throw new AppError("This user is blocked, please contact admins" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }

        // return username
        return user.username;
    }

    // Login as admin service
    async loginAdmin(userLoginDto:UserLoginDto): Promise<String>{
        
        // Get user from the database
        const user:User = await this.getUserByExactUsername(userLoginDto.username);
        
        // if user doesn't exist throw error and return
        if(!user){
            throw new AppError("User doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }
        
        // comapre given password with the hashed password in the database using bcrypt 
        const correctPassword:boolean = await bcrypt.compare(userLoginDto.password , user.password);
        
        // if passwords doesn't match throw error and return
        if(!correctPassword){
            throw new AppError("Incorrect password" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }

        // if user is blocked through error and return
        if(user.role !== "admin"){
            throw new AppError("This user is not an admin" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }

        // if user is blocked through error and return
        if(user.isBlocked){
            throw new AppError("This admin is blocked" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }

        // return username
        return user.username;
    }

    // Find all users in the "User" table (consider pagination in the query)
    async getAllUsers(limit:number , offset:number): Promise<{rows:User[], count:number}>{
        return await this.userModel.findAndCountAll({limit:limit , offset:offset , order:[["username" , "ASC"]] });
    }

    // Block or unblock user
    async userBlockUnblock(username:string): Promise<User>{

        // Get user from databse
        const user: User = await this.userModel.findOne({where: {username:username}});
        
        // Update user by inverting the "isBlocked" attribute (true will be false & false will be true) , and return updated user
        return (await this.userModel.update({ isBlocked: !user.isBlocked }, {where: {username: username} , returning:true} ))[1][0];
    }

    // Make admin or remove admin
    async userAdminUnadmin(username:string): Promise<User>{   
        
        // Get user from databse
        const user: User = await this.userModel.findOne({where: {username:username}});

        // if he was admin make him client and vice versa , then return updated user
        if(user.role === "admin"){
            return (await this.userModel.update({ role: "client" }, {where: {username: username} , returning:true} ))[1][0];
        }else{
            return (await this.userModel.update({ role: "admin" }, {where: {username: username} , returning:true} ))[1][0];
        }
    } 
}
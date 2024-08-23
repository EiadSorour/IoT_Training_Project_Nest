import { HttpException } from "@nestjs/common";
import { HttpStatusMessage } from "./httpStatusMessage.enum";

// Modified Error Object to make it easier to throw errors exceptions anywhere in the server
export class AppError extends HttpException {
    constructor(message:string , status:HttpStatusMessage , statusCode:number) {
        super({
            message: message,
            status: status,
            statusCode: statusCode
        } , statusCode);
    }
}
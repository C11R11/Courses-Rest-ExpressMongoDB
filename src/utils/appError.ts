export default class AppError extends Error
{
    status:string;
    statusCode:Number;
    isOperational: boolean;

    constructor(message:string, statusCode:number)
    {
        //the parent class gets the message 
        super(message);
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4") ? 'fail' : 'error'
        this.isOperational = true
    }
}
import { BaseModel } from "../baseModel/base.model";
export class BaseUserModel extends BaseModel{
    userName?: string;
    password?:string;
    phoneNumber?:string;
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}
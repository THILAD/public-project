import {BaseModel} from "../baseModel/base.model";
export class BaseHotelRoom extends BaseModel{
    nameHotel?: string;
    roomHotel?: string;
    imagesHotel?: string;
    statusHotel?: string;
    locationHotel?: string;
    nearestlocationHotel?: string;
    priceHotel?: string;
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}

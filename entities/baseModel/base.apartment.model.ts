import {BaseModel} from "../baseModel/base.model";
export class BaseApartmentRoom extends BaseModel{
    nameApartment?: string;
    roomApartment?: string;
    imagesApartment?: string;
    statusApartment?: string;
    locationApartment?: string;
    nearestlocationApartment?: string;
    priceApartment?: string;
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}
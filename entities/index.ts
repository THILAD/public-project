import { HotelFactory} from "../entities/entity/hotel.entity";
import { ApartmentFactory} from "../entities/entity/apartmen.entity";

import { User,UserFactory} from "../entities/entity/user.entity";


import {  Sequelize} from "sequelize";
export const dbconnection = new Sequelize('testapp','root','Skill007',{
    host:'localhost',
    dialect:'mysql'
});
export enum EntityPrifix{
    Users='Usermember',
    Messagssses='Messages 123432'
}
export enum EntityHotelPrifix{
    Hotellist='hotel',
    Messagessw='Messages 123432'
}
export enum EntityApartmentPrifix{
    Apartmentlist='apartment',
    Messagessw='Messages 123432'
}
// prifix entity
export const UserEntity= UserFactory(EntityPrifix.Users,dbconnection);
export const HotelEntity= HotelFactory(EntityHotelPrifix.Hotellist,dbconnection);
export const ApartmentEntity= ApartmentFactory(EntityApartmentPrifix.Apartmentlist,dbconnection);

export function initDB():Promise<Sequelize>{
   return new Promise<Sequelize>(async (resolve,reject)=>{
       try {
        await UserEntity.sync();
        await  HotelEntity.sync();
        await  ApartmentEntity.sync();
        resolve(dbconnection)
       } catch (error) {
           reject(error);
       }
   
   });
    
}


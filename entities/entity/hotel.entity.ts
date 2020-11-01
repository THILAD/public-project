import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { BaseHotelRoom} from "../baseModel/base.hotel.room.model";

//aatribute
export interface HotelAttributes extends BaseHotelRoom {
    role:string
}
//  Model
export interface HotelModel extends Model<HotelAttributes>, HotelAttributes {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    };
}
// object
export class Hotellist  extends Model<HotelAttributes,HotelAttributes>  {
    prototype: {
        validPassword: (password: string) => boolean;
        hashpassword: (password: string) => string;
    } | undefined;
}
// status object
export type Hotelltstatic = typeof Model & {
    new(values?: object, options?: BuildOptions): HotelAttributes;
};

// entity factory
export const HotelFactory = (name: string, sequelize: Sequelize): Hotelltstatic => {
    const attributes: ModelAttributes<HotelModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        nameHotel: {
            type: DataTypes.STRING, allowNull: false,
        },
        roomHotel: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        imagesHotel:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        statusHotel:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        locationHotel:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        nearestlocationHotel:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        priceHotel:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<HotelModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }

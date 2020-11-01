import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { BaseApartmentRoom } from "../baseModel/base.apartment.model";

//aatribute
export interface ApartmentAttributes extends BaseApartmentRoom {
    role:string
}
//  Model
export interface ApartmentModel extends Model<ApartmentAttributes>, ApartmentAttributes {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    };
}
// object
export class Apartment  extends Model<ApartmentModel,ApartmentAttributes>  {
    prototype: {
        validPassword: (password: string) => boolean;
        hashpassword: (password: string) => string;
    } | undefined;
}
// status object
export type Apartmentliststatic = typeof Model & {
    new(values?: object, options?: BuildOptions): ApartmentModel;
};

// entity factory
export const ApartmentFactory = (name: string, sequelize: Sequelize): Apartmentliststatic => {
    const attributes: ModelAttributes<ApartmentModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        nameApartment: {
            type: DataTypes.STRING, allowNull: false,
        },
        roomApartment: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        imagesApartment:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        statusApartment:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        locationApartment:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        nearestlocationApartment:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        priceApartment:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<ApartmentModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }

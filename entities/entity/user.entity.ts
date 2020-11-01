import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import {BaseUserModel } from "../baseModel/base.user.model";
import * as bcryptjs from 'bcryptjs';
import { request } from "express";
export interface UserAttributes extends BaseUserModel {
    role: string;
}
//model
export interface UserModel extends Model<UserAttributes>, UserAttributes {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => boolean;
    };
}
//object
export class User extends Model<UserModel, UserAttributes>{
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    } | undefined;
}
// static object
export type UserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
}
//entity hactory
export const UserFactory = (name: string, sequelize: Sequelize): UserStatic => {
    const attributes: ModelAttributes<UserModel> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }
        },
        password: {
            type: DataTypes.TEXT, allowNull: false
        },
        role: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.BIGINT, unique: true, validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }
        },
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true
        },
       
    } as ModelAttributes<UserModel>;


    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true });

    x.prototype.hashPassword = function (password: string): string {
        if (!password) return '';
        return this.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (password: string): boolean {
        const str = password + this.userName + this.phoneNumber;
        console.log('valid password', str, "length", str.length);
        console.log('valid password', this.password);
        if (bcryptjs.compareSync(str, this.password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('password')) {
            if (user.password && user.userName && user.phoneNumber) {
                const str = user.password + user.userName + user.phoneNumber;
                console.log('create password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        console.log('has', hash);
                        user.password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('password')) {
            if (user.password && user.userName && user.phoneNumber) {
                const str = user.password + user.userName + user.phoneNumber;
                console.log('update password', str, "length", str.length);

                return bcryptjs.hash(user.password + user.userName + user.phoneNumber, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
} 
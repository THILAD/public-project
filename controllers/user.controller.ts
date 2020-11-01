

import { Request, Response, NextFunction, Application } from "express";
import { UserEntity, dbconnection } from "../entities";
import { User, UserModel } from "../entities/entity/user.entity";
import { APIService } from "../services/api.service";
import {  Sequelize} from "sequelize";

export interface ILogin {
    userName: string;
    password: string;
}
export interface IChangePassword {
    userName: string;
    password: string;
    oldPassword: string;
}
export class UserController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        //dbconnection.authenticate().then(r => {
            //console.log('connection to sql', r);
            //sync
           // UserEntity.sync();
            //USERLIST
            //passed
            app.get('/', UserController.GetUserList)
                // LOGGED IN 
                .delete('/delete-user', UserController.DeleteUser)
                .post('/login', UserController.Login)
                .post('/get-user-details', UserController.checkAuthorize, UserController.GetUserDetails)
                .patch('/update-user', UserController.UpdateUser)
                .patch('/reset-password', UserController.ResetPassword)
                .put('/admin/createUser', UserController.CheckAdminAuthorizeToken, UserController.CreateUser)
       // });
    }
    //CRUD
    // get all user list passed thonthilad
    static GetUserList(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 5;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            UserEntity.findAll({ limit, offset: skip * limit }).then(r => {
                res.send(APIService.okRes(r));
            })
        } catch (error) {
            res.send(APIService.errRes(error))
        }
    }
    // get user detail passed thonthilad
    static GetUserDetails(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            UserEntity.findByPk(id).then(r => {
                if (r) {
                    const u = APIService.clone(r);
                    delete u.role;
                    delete u.password;
                    return res.send(APIService.okRes(u));
                } else {
                    res.send(APIService.errRes({}));
                }
                // const token = APIService.requestToken(req);
            }).catch(e => {
                res.send(APIService.errRes(e));
            })
        } catch (error) {
            console.log(error);
            res.send(APIService.errRes(error))
        }
    }
    //create user passed thonthilad
    static async CreateUser(req: Request, res: Response) {
        try {
            const user = req.body as UserModel;
            dbconnection.transaction().then(transaction => {
                // check exist user
                UserEntity.findOne({ where: { userName: user.userName, phoneNumber: user.phoneNumber }, transaction }).then(async r => {
                    if (r) {
                        await transaction.rollback();
                        res.send(APIService.errRes('User exist'));
                    } else {
                        UserEntity.create(user).then(r => {
                            res.send(APIService.okRes(r, 'created ok'));
                        }).catch(e => {
                            res.send(APIService.errRes(e));
                        })
                    }
                })
            });
        } catch (error) {
            res.send(APIService.errRes(error));
        }
        // const transaction = await dbConnection.transaction();
    }
    //update user passed thonthilad
    static UpdateUser(req: Request, res: Response) {
        try {
            const id = req.body.id + '';
            const users = req.body as UserModel;
            UserEntity.findByPk(id).then(async r => {
                if (r) {
                    r['userName'] = users.userName,
                        r['password'] = users.password,
                        r['phoneNumber'] = users.phoneNumber
                    let x = await r.save();
                    res.send({ status: 1, data: x, message: 'update OK' });
                    res.send(APIService.okRes(r, 'created ok'));
                }
            }).catch(e => {
                res.send({ status: 0, data: e, message: 'update failed' });
            });
        } catch (e) {
            res.send(APIService.errRes(e));
            console.log(e);
        }
    }
    //delete user passed thonthilad
    static DeleteUser(req: Request, res: Response) {
        let id = req.body.id + '';
        UserEntity.findByPk(id).then(async r => {
            let x = r.destroy();
            res.send({ status: 1, data: x, message: 'Delete OK' })
        }).catch(e => {
            res.send({ status: 0, data: e, message: 'Delete failed' })

        })
    }
    // static async CreateJobList(req: Request, res: Response) {
    //     try {
    //         const user = req.body as UserModel;
    //         dbconnection.transaction().then(transaction => {
    //             // check exist user
    //             UserEntity.findOne({ where: { userName: user.userName, phoneNumber: user.phoneNumber }, transaction }).then(async r => {
    //                 if (r) {
    //                     await transaction.rollback();
    //                     res.send(APIService.errRes('User exist'));
    //                 } else {
    //                     UserEntity.create(user).then(r => {
    //                         res.send(APIService.okRes(r, 'created ok'));
    //                     }).catch(e => {
    //                         res.send(APIService.errRes(e));
    //                     })
    //                 }
    //             })
    //         });

    //     } catch (error) {
    //         res.send(APIService.errRes(error));
    //     }
    //     // const transaction = await dbConnection.transaction();
    // }

    // // TOUY 14/09/2020 adde ResetPassword
    static ResetPassword(req: Request, res: Response) {
        const login = req.body as ILogin;
        if (login.userName && login.password) {
            UserEntity.findOne({ where: { userName: login.userName } }).then(r => {
                if (r) {
                    r.password = login.password;
                    r.save();
                    res.send(APIService.okRes('Reset password ok'));
                }
                else {
                    res.send(APIService.errRes('user not found'));
                }

            }).catch(e => {
                console.log('error login ', e);

                res.send(APIService.errRes(e, 'Error Reset password'));
            })

        } else {
            res.send(APIService.errRes('Empty username or password'));
        }
    }
    // TOUY 14/09/2020 adde changepassword
    //   static ChangePassword(req: Request, res: Response) {
    //     const login = req.body as IChangePassword;
    //     console.log('CCCCCCCCCCCCCC',req['_user']);
    //     const _user = req['_user'] as UserModel;
    //     console.log('_User',_user);

    //     if (login.userName===_user.userName && login.password&&login.password.length>5&&login.password.length<51&&login.oldPassword) {
    //         UserEntity.findOne({ where: { userName: login.userName } }).then(r => {
    //             if(r){
    //                 if(r.validPassword(login.oldPassword)){
    //                     r.password=login.password;
    //                     r.save();
    //                     res.send(APIService.okRes('change password ok'));
    //                 }
    //                 else{
    //                     res.send(APIService.errRes('wrong password'));
    //                 }
    //             }
    //             else {
    //                 res.send(APIService.errRes('user not found'));
    //             }

    //         }).catch(e => {
    //             console.log('error login ', e);

    //             res.send(APIService.errRes(e, 'Error Reset password'));
    //         })

    //     } else {
    //         res.send(APIService.errRes('Empty username or password'));
    //     }
    // }

    //Post login
    static Login(req: Request, res: Response) {
        const login = req.body as ILogin;
        if (login.userName && login.password) {
            UserEntity.findOne({ where: { userName: login.userName } }).then(r => {
                console.log('login r', r);

                if (r) {
                    if (r.validPassword) {
                        if (r.validPassword(login.password)) {
                            const user = APIService.clone(r);
                            delete user.role;
                            delete user.password;
                            delete user.phoneNumber;
                            const token = APIService.createToken(user as UserModel);
                            res.setHeader('authorization', token);
                            res.send(APIService.okRes({ user, token }, 'Login OK'));
                        }
                        else {
                            res.send(APIService.errRes('Incorrect password'));
                        }
                    }
                } else {
                    res.send(APIService.errRes('Username not found'));

                }
            }).catch(e => {
                console.log('error login ', e);

                res.send(APIService.errRes(e, 'Error login'));
            })

        } else {
            res.send(APIService.errRes('Empty username or password'));
        }
    }
    //echeck addmin  authori
    static CheckAdminAuthorization(req: Request, res: Response, next: NextFunction) {
        const login = req.body as ILogin;
        if (login.userName && login.password) {
            if (login.userName === 'super-admin' && login.password === '55F^fFS`},srzWc[b[]e{2F~/.#SQw') {
                return next();
            }
        }
        res.status(402).send('You have no an authorization!')

    }
    // authorization
    static checkAuthorize(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'] + '';
        const newToken = APIService.validateToken(token);
        req.headers['authorization'] = newToken;
        res.setHeader('authorization', newToken);
        if (newToken) {
            next();
        }
        else {
            res.status(402).send('You have no an authorization!')
        }
    }
    static checkIsYourSelf(req: Request, res: Response, next: NextFunction) {
        if (APIService.checkMySelf(req.headers['authorization'] + '', req)) {
            next();
        } else {
            res.status(402).send('You have no an authorization!')
        }
    }
    static CheckAdminAuthorizeToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['super-admin-authorization'] + '';

        if (APIService.vatlidateSuperAdmin(token)) {
            return next();
        }
        // else {
        res.status(402).send('You have no an authorization!')
        // }
    }

}






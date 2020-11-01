
import { dbconnection, UserEntity,initDB } from "../entities";
import { UserController } from "./user.controller";
import { HotelController } from "./hotel.controller";

// import { JoblistController } from "./controllers/joblist.controller";
import { ApartmentController } from "./apartment.controller";
import { Application } from "express";


export function Init(app: Application) {
        initDB().then(r=>{
            console.log('connection to sql', r);

            new UserController(app);// routing
            new HotelController(app);
            new ApartmentController(app);
        }).catch(e=>{
            console.log(e);
            
        })
       
        //USERLIST
        //passed
        //     app.get('/userlist', UserController.GetUserList)
        //         // LOGGED IN 
        //         .delete('/delete-user',UserController.DeleteUser)
        //         .post('/login', UserController.Login)
        //         .post('/get-user-details', UserController.checkAuthorize, UserController.GetUserDetails)
        //         .patch('/update-user',UserController.UpdateUser)
        //         .patch('/reset-password', UserController.ResetPassword)
        //         .put('/admin/createUser', UserController.CheckAdminAuthorizeToken, UserController.CreateUser)

}

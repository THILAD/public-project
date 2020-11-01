import { Request, Response, Application } from "express";
import { HotelEntity, dbconnection } from "../entities";
import { BaseHotelRoom } from "../entities/baseModel/base.hotel.room.model";
import { HotelFactory, HotelModel } from "../entities/entity/hotel.entity";
import * as fs from 'fs';


const multer = require('multer');

export class HotelController {
    app: Application;


    constructor(app: Application) {
        this.app = app;
        //dbconnection.authenticate().then(r => {
        // console.log('connection to sql', r);
        //sync
        // HotelEntity.sync();
        //USERLIST
        //passed
        app.get('/hotel', HotelController.Gethotel)
            // LOGGED IN 
            .delete('/hotel', HotelController.DeleteHotelList)
            .post('/hotel', HotelController.GetHotelDetail)
            .patch('/hotel', HotelController.UpdateHotelList)
            .put('/hotel', HotelController.CreateHotellist)
        app.get('/image', (req: Request, res: Response) => {

        });
        // .put('/hotel/uploadfile', HotelController.Uploadfile)

        // });
    }
    //CRUD 


    // show hotel list
    static Gethotel(req: Request, res: Response) {
        console.log('rqbody', req.body);

        try {

            const limit = req.query.limit ? Number(req.query.limit) : 5;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            HotelEntity.findAll({ limit, offset: skip * limit }).then(r => {
                res.send({ message: 'Ok', status: 1, data: r })

            }).catch(e => {
                res.send({ status: 0, data: e })
            })

        } catch (error) {
            res.send({ status: 0, data: error })
        }
    }

    //SHOW JOB LIST SOME ID
    // passed


    // static uploadFile(req:Request , res:Response){

    // }
    static GetHotelDetail(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            HotelEntity.findByPk(id).then(r => {
                res.send({ status: 1, data: r });
                console.log('xxxxx id', id);

            }).catch(e => {
                res.send({ status: 0, data: e })

            })
        } catch (error) {
            res.send({ status: 0, data: error })

        }
    }
    //CREATE
// static CreateHotellist(req: Request, res: Response){

// }
static CreateHotellist(req: Request, res: Response) {
    {
        const hotel = req.body as HotelModel;
        console.log(req.body);
console.log('wwwwwwwwwwwwwwwww',hotel);
          var image = req.body.imagesHotel.img;
            // console.log('file name', req.body.imagesHotel.img);

            var filename = "images/" + Date.now() + req.body.imagesHotel.name
            // console.log('file name', req.body.imagesHotel.name);

            fs.writeFileSync(filename, image.split(';base64,').pop(), { encoding: 'base64' });
            req.body.image = filename;
            
        dbconnection.transaction().then(transaction => {
            HotelEntity.findOne({
                                 where: {
                        nameHotel: hotel.nameHotel,
                        roomHotel: hotel.roomHotel,
                        imagesHotel: hotel.imagesHotel,
                        statusHotel: hotel.statusHotel,
                        locationHotel: hotel.locationHotel,
                        nearestlocationHotel: hotel.nearestlocationHotel,
                        priceHotel: hotel.priceHotel
                    }
            }).then(async r => {
                if (r) {
                    console.log('=====================r', r);

                    await transaction.rollback();

                } else {
                    HotelEntity.create(hotel).then(r => {
                        res.send({ status: 1, data: [],r})
                        console.log(r);

                    })
                        .catch(e => {
                            res.send({ status: 0, data: e })
                        })
                }
            })
        })
    }

}

    // passed
    // static CreateHotellist(req: Request, res: Response) {

    //     try {
    //         const hotel = req.body as HotelModel;

    //         console.log("console reqeust photo2", req.body);
    //         console.log("console reqeust nameHotel", req.body.nameHotel);


    //         var image = req.body.imagesHotel.img;
    //         // console.log('file name', req.body.imagesHotel.img);

    //         var filename = "images/" + Date.now() + req.body.imagesHotel.name
    //         // console.log('file name', req.body.imagesHotel.name);

    //         fs.writeFileSync(filename, image.plit(';base64,').pop(), { encoding: 'base64' });
    //         req.body.image = filename;
    //         dbconnection.transaction().then(transaction => {
    //             HotelEntity.findOne({
    //                 where: {
    //                     nameHotel: hotel.nameHotel,
    //                     roomHotel: hotel.roomHotel,
    //                     imagesHotel: hotel.imagesHotel,
    //                     statusHotel: hotel.statusHotel,
    //                     locationHotel: hotel.locationHotel,
    //                     nearestlocationHotel: hotel.nearestlocationHotel,
    //                     priceHotel: hotel.priceHotel
    //                 }
    //             }).then(async r => {
    //                 if (r) {
    //                     console.log('=====================r', r);

    //                     await transaction.rollback();

    //                 } else {

    //                     HotelEntity.create(hotel).then(r => {
    //                         res.send({ status: 1, data: [], r })
    //                         console.log(r);

    //                     })
    //                         .catch(e => {
    //                             res.send({ status: 0, data: e })
    //                         })
    //                 }
    //             })
    //         })
    //     }
    //     catch (error) {
    //         res.send({ status: 0, data: error })
    //     }
    // }
    // DELETE LIST JOB
    // delete passed
    static DeleteHotelList(req: Request, res: Response) {
        let id = req.body.id + '';
        HotelEntity.findByPk(id).then(async r => {
            console.log('xxxxxxxxxxxxx id', id);

            let x = r.destroy();
            res.send({ status: 1, data: x, meeage: 'delete OK' });
        }).catch(e => {
            res.send({ status: 0, data: e });
        });
    }
    //UpdateJobList
    // passed
    static UpdateHotelList(req: Request, res: Response) {
        let id = req.body.id + '';
        console.log(req.body);
        let hotel = req.body as HotelModel;
        HotelEntity.findByPk(id).then(async r => {
            if (r) {
                console.log('------------------', r);

                r['nameHotel'] = hotel.nameHotel,
                    r['roomHotel'] = hotel.roomHotel,
                    r['imagesHotel'] = hotel.imagesHotel,
                    r['statusHotel'] = hotel.statusHotel,
                    r['locationHotel'] = hotel.locationHotel,
                    r['nearestlocationHotel'] = hotel.nearestlocationHotel,
                    r['priceHotel'] = hotel.priceHotel

                let x = await r.save();
                res.send({ status: 1, data: x });
            } else {
                res.send({ status: 0, data: [], message: 'update failed' });
            }
        })
        // }).catch(e => {
        //     res.send({ status: 0, data: e });
        // });
    }

}

import { ApartmentFactory, ApartmentModel } from './../entities/entity/apartmen.entity';
import { Request, Response, Application } from "express";
import { BaseApartmentRoom } from "../entities/baseModel/base.apartment.model";
import { ApartmentEntity, dbconnection } from "../entities";

export class ApartmentController {
    app: Application;
    constructor(app: Application) {
        console.log('apartment');
        this.app = app;


            //USERLIST
            //passed
            app.get('/apartment', ApartmentController.Getapartment)
                .post('/get-user-details', ApartmentController.GetApartmentDetail)
                .put('/apartment', ApartmentController.CreateApartment)
                .patch('/update-apartment', ApartmentController.UpdateApartment)
                .delete('/delete-apartment', ApartmentController.DeleteApartment)
    }
    //CRUD
    ///show apartment list
    static Getapartment(req: Request, res: Response) {
        try {

            const limit = req.query.limit ? Number(req.query.limit) : 5;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            ApartmentEntity.findAll({ limit, offset: skip * limit }).then(r => {
                res.send({ message: 'Ok', status: 1, data: r })

            }).catch(e => {
                res.send({ status: 0, data: e })
            })

        } catch (error) {
            res.send({ status: 0, data: error })
        }
    }
    //show  by id
    static GetApartmentDetail(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            ApartmentEntity.findByPk(id).then(r => {
                res.send({ status: 1, data: r });
                console.log('xxxxx id', id);

            }).catch(e => {
                res.send({ status: 0, data: e })

            })
        } catch (error) {
            res.send({ status: 0, data: error })

        }
    }
    //Create Apartment
    static CreateApartment(req: Request, res: Response) {
        {
            const apartment = req.body as ApartmentModel;
            console.log(req.body);
console.log('wwwwwwwwwwwwwwwww',apartment);

            dbconnection.transaction().then(transaction => {
                ApartmentEntity.findOne({
                    where: {
                        nameApartment:apartment.nameApartment,
                        roomApartment: apartment.roomApartment,
                        imagesApartment: apartment.imagesApartment,
                        statusApartment: apartment.statusApartment,
                        locationApartment: apartment.locationApartment,
                        nearestlocationApartment: apartment.nearestlocationApartment,
                        priceApartment: apartment.priceApartment
                    }
                }).then(async r => {
                    if (r) {
                        console.log('=====================r', r);

                        await transaction.rollback();

                    } else {
                        ApartmentEntity.create(apartment).then(r => {
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
    static DeleteApartment(req: Request, res: Response) {
        let id = req.body.id + '';
        ApartmentEntity.findByPk(id).then(async r => {
            console.log('xxxxxxxxxxxxx id', id);

            let x = r.destroy();
            res.send({ status: 1, data: x, meeage: 'delete OK' });
        }).catch(e => {
            res.send({ status: 0, data: e });
        });
    }
    static UpdateApartment(req: Request, res: Response) {
        let id = req.body.id + '';
        console.log(req.body);
        let Apartment = req.body as ApartmentModel;
        ApartmentEntity.findByPk(id).then(async r => {
            if (r) {
                console.log('--------', r);

                r['nameApartment'] = Apartment.nameApartment,
                    r['roomApartment'] = Apartment.roomApartment,
                    r['imagesApartment'] = Apartment.imagesApartment,
                    r['statusApartment'] = Apartment.statusApartment,
                    r['locationApartment'] = Apartment.locationApartment,
                    r['nearestlocationApartment'] = Apartment.nearestlocationApartment,
                    r['priceApartment'] = Apartment.priceApartment

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
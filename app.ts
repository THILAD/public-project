import { Request, Response, Application } from "express";
import express from 'express';
import cors from "cors";
import * as bodyParser from "body-parser";
// import { DataType, Sequelize, INTEGER } from "sequelize";
// import { dbconnection, UserEntity } from "./entities";

import * as controller from './controllers/index';



export let app: Application = express();
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));
app.use('./images', express.static('images'))
app.use(cors());

controller.Init(app);




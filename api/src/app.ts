import "reflect-metadata";
import * as http from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import cors from 'cors';
import { getPort } from './config/app.config';
import { createConnection } from "typeorm";

// importing routers
import userRouter from './routes/user.route';
import imageRouter from './routes/image.route';


createConnection().then(connention => {
    const app: Application = express();

    // enabling cors
    const options = {
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, x-auth-token",
        exposedHeaders: "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
    }
    app.use(cors(options));

    const jsonParser: any = json({
        inflate: true,
        limit: '10mb',
        type: 'application/json',
        verify: (req: http.IncomingMessage, res: http.ServerResponse, buf: Buffer, encoding: string) => {
            return true;
        },
    })

    // using json parser and urlencoder
    app.use(jsonParser);
    app.use(urlencoded({ extended: true }));


    // public folder conf
    app.use(express.static(path.join(__dirname, 'public')));

    // routes
    app.use('/user', userRouter);
    app.use('/image', imageRouter);


    // global exceptin handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            reason: err.message
        });
    })

    // for handling uncaught exception from application
    process.on('uncaughtException', (err) => {
        console.error("Uncaught Exception : ", err.message);
        process.exit(1);
    });

    process.on('unhandledRejection', (error) => {
        console.error("From event: ", error?.toString());
        process.exit(1);
    });


    // port number
    const port: number = getPort();

    // starting the server
    app.listen(port, () => console.log("Server Started at port " + port));



}).catch(ex => {
    console.error("Database Connection Error: ", ex);
    process.exit(1);
});





import express, { Router, Request, Response, NextFunction } from 'express';
import { wrap } from '../middlewares/exception-handler.middle';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user.entity';
import { getManager } from 'typeorm';
import { getAuthJWTSecret } from '../config/secrets.config';
import { auth } from '../middlewares/auth.middle';
import { Image } from '../entity/image.entity';

const router: Router = express.Router();

/**
 * Create user
 */
router.post('/', [], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const newUser: User = new User();

    newUser.username = req.body.username;
    newUser.password = hashPass;

    const newUserInstance: User = await getManager().getRepository(User).save(newUser);


    return res.status(201).json({
        statusCode: 201,
        message: "Request Successful",
        data: {
            id: newUserInstance.id
        }
    })

}));

/**
 * Login User Token Based
 */
router.post('/login', [], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = await getManager().createQueryBuilder(User, "user")
        .addSelect("user.password")
        .where("user.username = :username", { username: req.body.username })
        .getOne();

    if (user) {
        const isPassValid: boolean = await bcrypt.compare(req.body.password, user.password);
        if (!isPassValid) {
            return res.status(400).json({
                statusCode: 401,
                message: "Login failed",
                reason: "Invalid Credentials"
            });
        }

        const jwtPayload = {
            id: user.id
        }
        // token generate
        let jwtToken = jwt.sign(
            jwtPayload,
            getAuthJWTSecret(),
            { expiresIn: '10h' }
        );


        // sending token
        return res.header('x-auth-token', jwtToken).status(200).json({
            statusCode: 200,
            message: "Authentication Successful",
            data: {
                authToken: jwtToken
            }
        });

    }
    else {
        return res.status(400).json({
            statusCode: 401,
            message: "Login failed",
            reason: "Invalid Credentials"
        });
    }

}));



/**
 * Upload Image
 */
router.post('/image', [auth], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const newImage: Image = new Image();
    newImage.title = req.body.title;
    newImage.data = Buffer.from(req.body.data, 'base64');
    newImage.mimeType = req.body.mimeType;
    newImage.views = 0;
    newImage.likes = 0;
    newImage.blockedRequests = 0;
    if (req.body.allowList) newImage.allowList = req.body.allowList;
    if (req.body.deleteAfter) newImage.deleteAfter = req.body.deleteAfter;

    const newImageInstance: Image = await getManager().getRepository(Image).save(newImage);

    await getManager().createQueryBuilder()
        .relation(User, "images")
        .of(req.user.id)
        .add(newImageInstance);

    return res.status(201).json({
        statusCode: 201,
        message: "Request Successful",
        data: {
            id: newImageInstance.id,
            sharableLink: `http://127.0.0.1:3030/image/get/${newImageInstance.id}`
        }
    })

}));

/**
 * User Images statistics
 */
router.get('/stat', [auth], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const report = await getManager().getRepository(User).createQueryBuilder("user")
        .where({ id: req.user.id })
        .select(["user.id", "images.title", "images.views", "images.likes", "images.blockedRequests"])
        .leftJoin("user.images", "images")
        .getMany()

    return res.status(200).json({
        statusCode: 200,
        message: "Request Successful",
        data: report
    })
}));


/**
 * Update a image by user
 */
 router.put('/image', [auth], wrap(async (req: Request, res: Response, next: NextFunction) => {
     const image: Image | undefined = await getManager().getRepository(Image).findOne(req.body.id,{
         relations: ["user"]
     });
     if(image && image.user.id === req.user.id) {
        image.title = req.body.title;
        image.data = Buffer.from(req.body.data, 'base64');
        image.mimeType = req.body.mimeType
        const result = await getManager().getRepository(Image).save(image);
        return res.status(200).json({
            statusCode: 200,
            message: "Request Successful",
            data: {
                id: result.id
            }
        })
     }
     else {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid Request"
        })
     }
 }));






export default router;
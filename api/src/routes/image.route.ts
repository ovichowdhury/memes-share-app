import express, { Router, Request, Response, NextFunction } from 'express';
import { wrap } from '../middlewares/exception-handler.middle';
import { Image } from '../entity/image.entity';
import { getManager } from 'typeorm';

const router: Router = express.Router();


/**
 * Get Sharable image
 */
router.get('/get/:id', [], wrap(async (req: Request, res: Response, next: NextFunction) => {

    const image: Image | undefined = await getManager().getRepository(Image).findOne(req.params.id);
    if (image) {
        const originOfReq: any = req.header("Origin");

        if (!image.allowList) {
            //update the view count
            await getManager().getRepository(Image).update(image.id, {
                views: image.views + 1
            });
            return res.status(200).json({
                statusCode: 200,
                message: "Request Successful",
                data: {
                    id: image.id,
                    base64Data: image.data.toString('base64'),
                    mimeType: image.mimeType
                }

            })
        }
        else {
            const index = image.allowList.indexOf(originOfReq)
            if (index > -1) {
                //update the view count
                await getManager().getRepository(Image).update(image.id, {
                    views: image.views + 1
                });
                return res.status(200).json({
                    statusCode: 200,
                    message: "Request Successful",
                    data: {
                        id: image.id,
                        base64Data: image.data.toString('base64'),
                        mimeType: image.mimeType
                    }

                })
            }
            else {
                // increase the block request count
                await getManager().getRepository(Image).update(image.id, {
                    blockedRequests: image.blockedRequests + 1
                });
                return res.status(200).json({
                    statusCode: 200,
                    message: "Forbidden Request",

                })
            }
        }


    }
    else {
        return res.status(400).json({
            statusCode: 400,
            message: "Image not exists",
        })
    }

}));


/**
 * Like Image
 */
router.post('/like/', [], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const image: Image | undefined = await getManager().getRepository(Image).findOne(req.body.id);
    if (image) {
        const result = await getManager().getRepository(Image).update(req.body.id, {
            likes: image.likes + 1
        });

        return res.status(200).json({
            statusCode: 200,
            message: "Image Liked",
        })
    }
    else {
        return res.status(400).json({
            statusCode: 400,
            message: "Image not exists",
        })
    }

}));


/**
 * Sort Image by top views and likes
 */
router.get('/sort/', [], wrap(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getManager().getRepository(Image).createQueryBuilder("image")
        .select()
        .orderBy("image.views", "DESC")
        .addOrderBy("image.likes", "DESC")
        .getMany();

    result.forEach((r:any) => r.data = r.data.toString('base64'));

    return res.status(200).json({
        statusCode: 200,
        message: "Request Successful",
        data: result
    })

}));



export default router;
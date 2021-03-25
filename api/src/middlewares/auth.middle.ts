import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { getAuthJWTSecret } from "../config/secrets.config";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    // check token
    const token = req.headers["x-auth-token"];
    if (!token) return res.status(400).json({
        statusCode: 401,
        message: "No Token Found"
    });

    try {
        if (typeof token === "string") {
            const tokenData: any = jwt.verify(token, getAuthJWTSecret());
            req.user = tokenData;
            console.log(req.user.id);
            next();

        }
        else throw new Error();

    }
    catch (ex) {
        return res.status(400).json({
            statusCode: 401,
            message: "Invalid Token"
        });
    }

}

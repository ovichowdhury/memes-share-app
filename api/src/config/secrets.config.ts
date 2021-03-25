import { appConf } from "./app.config";

export function getAuthJWTSecret() {
    return appConf.AUTH_JWT_SECRET || "123456789";
}

